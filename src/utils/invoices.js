import bech32 from 'bech32';
import axios from 'axios';
import { Buffer } from 'buffer';
import LightningPayReq from '../lib/bolt11';

const BOLT11_SCHEME = 'lnbc';
const LNURL_SCHEME = 'LNURL';
const LNURL_ERROR_TYPE = 'ERROR';

export const parseInvoice = (invoice: string) => {
  if (!invoice || invoice === '') {
    return null;
  }

  // Check if Invoice has `lightning` prefix
  // (9 chars + the `:` or `=` chars) --> 10 characters total
  const lcInvoice = invoice.toLowerCase();
  const hasLightningPrefix = lcInvoice.indexOf('lightning') !== -1;

  let parsedInvoice = lcInvoice;
  if (hasLightningPrefix) {
    // Remove the `lightning` prefix
    parsedInvoice = lcInvoice.slice(10, lcInvoice.length);
  }

  // Parse LNURL or BOLT11
  const isLNURL = invoice.indexOf(LNURL_SCHEME) !== -1;
  if (isLNURL) {
    return handleLNURL(parsedInvoice);
  } else {
    return handleBOLT11(parsedInvoice);
  }
};

const handleLNURL = (invoice: string) => {
  // Decoding bech32 LNURL
  const decodedLNURL = bech32.decode(invoice, 1500);
  const url = Buffer.from(bech32.fromWords(decodedLNURL.words)).toString();

  return axios.get(url, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  }).then(res => res.json());
};

const handleBOLT11 = (invoice: string) => {
  // Check if Invoice starts with `lnbc` prefix
  if (!invoice.includes(BOLT11_SCHEME)) {
    return null;
  }

  const bolt11 = invoice.toLowerCase();

  return LightningPayReq.decode(bolt11);;
};
