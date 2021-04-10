import bech32 from 'bech32';
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

  // Check if Invoice has `lightning:` prefix
  // (9 chars + the `:` char) --> 10 characters total
  const hasLightningPrefix = lcInvoice.indexOf(`${LIGHTNING_SCHEME}`) !== -1;
  if (hasLightningPrefix) {
    // Remove the `lightning` prefix
    requestCode = lcInvoice.slice(10, lcInvoice.length);
  }

  // It has to be either LNURL or BOLT11 mainnet (LNBC)
  const hasLNURLprefix = lcInvoice.indexOf(`${LNURL_SCHEME}`) !== -1;
  const hasLNBCprefix = lcInvoice.indexOf(`${BOLT11_SCHEME}`) !== -1;

  if (hasLNURLprefix) {
    return {
      isLNURL: true,
      data: handleLNURL(requestCode)
    };
  } else if (hasLNBCprefix) {
    return {
      isLNURL: false,
      data: handleBOLT11(requestCode)
    };
  } else {
    return null;
  }
};

const handleLNURL = (invoice: string) => {
  // Decoding bech32 LNURL
  const decodedLNURL = bech32.decode(invoice, 1500);
  const url = Buffer.from(bech32.fromWords(decodedLNURL.words)).toString();

  return fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data;
    })
    .catch(function () {
      return null;
    });

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
