import bech32 from 'bech32';
import { Buffer } from 'buffer';

import { validateInternetIdentifier } from './internet-identifier';
import LightningPayReq from '../lib/bolt11';
import Offer from '../lib/bolt12';
import { LNADDRESS, LNURL, BOLT11, BOLT12, LIGHTNING_SCHEME, BOLT11_SCHEME_MAINNET, BOLT11_SCHEME_TESTNET, LNURL_SCHEME, BOLT12_SCHEME } from '../constants/invoices';

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
        encodingType: LNADDRESS,
      };
    }

    return {
      data,
      isLNURL: true,
      isLNAddress: true,
      encodingType: LNADDRESS,
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
      encodingType: LNURL,
      data: handleLNURL(requestCode)
    };
  }

  const isBOLT12 = requestCode.startsWith(BOLT12_SCHEME);
  if (isBOLT12) {
    return {
      isLNURL: false,
      isBOLT12: true,
      encodingType: BOLT12,
      data: await handleBOLT12(requestCode)
    };
  }


  return {
    isLNURL: false,
    isBOLT12: false,
    encodingType: BOLT11,
    data: handleBOLT11(requestCode)
  };

};

const handleLNURL = (invoice: string) => {
  // Decoding bech32 LNURL
  const decodedLNURL = bech32.decode(invoice, 1500);
  const url = Buffer.from(bech32.fromWords(decodedLNURL.words)).toString();

  return fetch(url)
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

const handleBOLT11 = (invoice: string) => {
  // Check if Invoice starts with `lnbc` prefix
  if (!invoice.includes(BOLT11_SCHEME_MAINNET) && !invoice.includes(BOLT11_SCHEME_TESTNET)) {
    return null;
  }

  // Decoded BOLT11 Invoice
  const result = LightningPayReq.decode(invoice);

  return result;
};

const handleBOLT12 = async (offer: string) => {
  // Check if offer starts with lno
  if (!offer.startsWith('lno')) {
    return null;
  }

  const decoded_offer = await Offer.decode(offer);
  return decoded_offer;
};


