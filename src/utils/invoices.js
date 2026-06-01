import bech32 from 'bech32';
import { Buffer } from 'buffer';
import BOLT12Decoder from 'bolt12-decoder';

import { validateInternetIdentifier } from './internet-identifier';
import * as LightningPayReq from '../lib/bolt11';

const LIGHTNING_SCHEME = 'lightning';
const BOLT11_SCHEME_MAINNET = 'lnbc';
const BOLT11_SCHEME_TESTNET = 'lntb';
const LNURL_SCHEME = 'lnurl';
const BOLT12_SCHEMES = ['lno1', 'lni1', 'lnr1']; // offer, invoice, invoice_request

export const parseInvoice = async (invoice) => {
  if (!invoice || invoice === '') {
    return null;
  }

  const lcInvoice = invoice.trim().toLowerCase();
  let requestCode = lcInvoice;

  // Check if this is a Lightning Address
  if (validateInternetIdentifier(requestCode)) {
    const { success, data, message } = await handleLightningAddress(requestCode);

    if (!success) {
      return {
        data: null,
        error: message,
        isLNURL: false,
        isLNAddress: true,
      };
    }

    return {
      data,
      isLNURL: true,
      isLNAddress: true,
    }
  }

  // Check if Invoice has `lightning:` or `lnurl:` prefixes
  // (9 chars + the `:` or `=` chars) --> 10 characters total
  const hasLightningPrefix = lcInvoice.indexOf(`${LIGHTNING_SCHEME}:`) !== -1;
  if (hasLightningPrefix) {
    // Remove the `lightning:` prefix
    requestCode = lcInvoice.slice(10, lcInvoice.length);
  }

  // Check for LUD-01 fallback scheme: `lightning=` parameter
  const hasLightningParam = lcInvoice.indexOf(`${LIGHTNING_SCHEME}=`) !== -1;
  if (hasLightningParam) {
    // Remove everything before and including the `lightning=` parameter,
    // and stop at the next `&` if there are more query parameters
    requestCode = lcInvoice.split(`${LIGHTNING_SCHEME}=`)[1].split('&')[0];
  }

  // (5 chars + the `:` or `=` chars) --> 6 characters total
  const hasLNURLPrefix = lcInvoice.indexOf(`${LNURL_SCHEME}:`) !== -1;
  if (hasLNURLPrefix) {
    // Remove the `lnurl:` prefix
    requestCode = lcInvoice.slice(6, lcInvoice.length);
  }

  // Parse LNURL, BOLT12, or BOLT11
  const isLNURL = requestCode.startsWith(LNURL_SCHEME);
  if (isLNURL) {
    const lnurlData = await handleLNURL(requestCode);
    return {
      isLNURL: true,
      data: lnurlData
    };
  }

  // Check for BOLT12 (offer, invoice, or invoice_request)
  const isBOLT12 = BOLT12_SCHEMES.some(prefix => requestCode.startsWith(prefix));
  if (isBOLT12) {
    return {
      isBOLT12: true,
      isLNURL: false,
      data: handleBOLT12(requestCode)
    };
  }

  // Default to BOLT11
  return {
    isLNURL: false,
    data: handleBOLT11(requestCode)
  };
};

const handleLNURL = (invoice) => {
  // Decoding bech32 LNURL
  const decodedLNURL = bech32.decode(invoice, 1500);
  const url = Buffer.from(bech32.fromWords(decodedLNURL.words)).toString();

  return fetch(url)
    .then(r => {
      if (r.ok === false) {
        return Promise.reject(new Error(`LNURL service returned ${r.status || '?'} ${r.statusText || '?'}`));
      }
      return r.json();
    })
    .catch(error => {
      if (error.message && error.message.includes('NetworkError')) {
        return Promise.reject(new Error('Network error: Could not reach LNURL service. It may be offline or blocked by CORS.'));
      }
      if (error.message && error.message.includes('Failed to fetch')) {
        return Promise.reject(new Error('Network error: Could not reach LNURL service. It may be offline or blocked by CORS.'));
      }
      if (error.message && error.message.includes('JSON')) {
        return Promise.reject(new Error('Invalid response: LNURL service returned non-JSON data.'));
      }
      return Promise.reject(new Error(`LNURL fetch failed: ${error.message || 'Unknown error'}`));
    });
};

const handleLightningAddress = (internetIdentifier) => {
  const addressArr = internetIdentifier.split('@');

  // Must only have 2 fields (username and domain name)
  if (addressArr.length !== 2) {
    return {
      success: false,
      message: 'Invalid internet identifier format.',
    };
  }

  const [username, domain] = addressArr;

  // Must only have 2 fields (username and domain name)
  if (addressArr[1].indexOf('.') === -1) {
    return {
      success: false,
      message: 'Invalid internet identifier format.',
    };
  }

  const url = `https://${domain}/.well-known/lnurlp/${username}`;

  return fetch(url)
  .then(r => r.json())
  .then(data => {
    data.domain = domain;

    return {
      success: true,
      data: {
        ...data,
        domain,
        username,
      },
    }
  }).catch(_ => {
    return {
      success: false,
      message: 'This identifier does not support Lightning Address yet.',
    };
  });
};

const handleBOLT11 = (invoice) => {
  // Check if Invoice starts with `lnbc` prefix
  if (!invoice.includes(BOLT11_SCHEME_MAINNET) && !invoice.includes(BOLT11_SCHEME_TESTNET)) {
    return null;
  }

  // Decoded BOLT11 Invoice
  const result = LightningPayReq.decode(invoice);

  return result;
};

const handleBOLT12 = (invoice) => {
  try {
    const decoded = BOLT12Decoder.decode(invoice);
    return decoded;
  } catch (_) {
    return null;
  }
};

