import bech32 from 'bech32';
import { Buffer } from 'buffer';

import { validateInternetIdentifier } from './internet-identifier';
import LightningPayReq from '../lib/bolt11';

const LIGHTNING_SCHEME = 'lightning';
const BOLT11_SCHEME_MAINNET = 'lnbc';
const BOLT11_SCHEME_TESTNET = 'lntb';
const LNURL_SCHEME = 'lnurl';

export const parseInvoice = async (invoice: string) => {
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

  return fetch('https://satcors.fiatjaf.com/?url=' + encodeURIComponent(url))
  .then(r => r.json())
};

const handleLightningAddress = (internetIdentifier: string) => {
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

  return fetch('https://satcors.fiatjaf.com/?url=' + encodeURIComponent(url))
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

const handleBOLT11 = (invoice: string) => {
  // Check if Invoice starts with `lnbc` prefix
  if (!invoice.includes(BOLT11_SCHEME_MAINNET) && !invoice.includes(BOLT11_SCHEME_TESTNET)) {
    return null;
  }

  // Decoded BOLT11 Invoice
  const result = LightningPayReq.decode(invoice);

  return result;
};

