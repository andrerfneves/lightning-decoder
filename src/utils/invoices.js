import bech32 from 'bech32';
import axios from 'axios';
import { Buffer } from 'buffer';
import LightningPayReq from '../lib/bolt11';

const LIGHTNING_SCHEME = 'lightning';
const BOLT11_SCHEME = 'lnbc';
const LNURL_SCHEME = 'lnurl';

export const parseInvoice = (invoice: string) => {
  if (!invoice || invoice === '') {
    return null;
  }

  const lcInvoice = invoice.trim().toLowerCase();
  let requestCode = lcInvoice;

  // Check if Invoice has `lightning` or `lnurl` prefixes
  // (9 chars + the `:` or `=` chars) --> 10 characters total
  const hasLightningPrefix = lcInvoice.indexOf(`${LIGHTNING_SCHEME}:`) !== -1;
  if (hasLightningPrefix) {
    // Remove the `lightning` prefix
    requestCode = lcInvoice.slice(10, lcInvoice.length);
  }

  // (5 chars + the `:` or `=` chars) --> 6 characters total
  const hasLNURLPrefix = lcInvoice.indexOf(`${LNURL_SCHEME}:`) !== -1;
  if (hasLNURLPrefix) {
    // Remove the `lightning` prefix
    requestCode = lcInvoice.slice(6, lcInvoice.length);
  }

  // Parse LNURL or BOLT11
  const isLNURL = requestCode.startsWith(LNURL_SCHEME);
  if (isLNURL) {
    return {
      isLNURL: true,
      data: handleLNURL(requestCode)
    };
  } else {
    return {
      isLNURL: false,
      data: handleBOLT11(requestCode)
    };
  }
};

const handleLNURL = (invoice: string) => {
  // Decoding bech32 LNURL
  const decodedLNURL = bech32.decode(invoice, 1500);
  const url = Buffer.from(bech32.fromWords(decodedLNURL.words)).toString();

  return axios.get('https://cors-anywhere.herokuapp.com/' + url, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  }).then(res => {
    return res.data;
  })
};

const handleBOLT11 = (invoice: string) => {
  // Check if Invoice starts with `lnbc` prefix
  if (!invoice.includes(BOLT11_SCHEME)) {
    return null;
  }

  // Decoded BOLT11 Invoice
  const result = LightningPayReq.decode(invoice);

  return result;
};
