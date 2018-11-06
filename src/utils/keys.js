// Key Formatting Utilities
import {
  COIN_TYPE_KEY,
  COMPLETE_KEY,
  PAYEE_NODE_KEY,
  PAYMENT_REQUEST_KEY,
  PREFIX_KEY,
  TIMESTAMP_STRING_KEY,
  SATOSHIS_KEY,
  SIGNATURE_KEY,
  RECOVERY_FLAG_KEY,
  COMMIT_HASH_KEY,
  PAYMENT_HASH_KEY,
  FALLBACK_ADDRESS_KEY,
  ADDRESS_HASH_KEY,
  ADDRESS_KEY,
  CODE_KEY,
  DESCRIPTION_KEY,
  EXPIRY_HTLC,
} from '../constants/keys';

export const formatDetailsKey = (key: string) => {
  switch (key) {
    case COIN_TYPE_KEY:
      return 'Chain';
    case COMPLETE_KEY:
      return 'Tx Complete?';
    case PAYEE_NODE_KEY:
      return 'Payee Pub Key';
    case PAYMENT_REQUEST_KEY:
      return 'Payment Request';
    case PREFIX_KEY:
      return 'Prefix';
    case RECOVERY_FLAG_KEY:
      return 'Recovery Flag';
    case SATOSHIS_KEY:
      return 'Payment Amount';
    case SIGNATURE_KEY:
      return 'Tx Signature';
    case TIMESTAMP_STRING_KEY:
      return 'Timestamp';
    case COMMIT_HASH_KEY:
      return 'Commit Hash';
    case PAYMENT_HASH_KEY:
      return 'Payment Hash';
    case FALLBACK_ADDRESS_KEY:
      return 'Fallback Address';
    case ADDRESS_HASH_KEY:
      return 'Address Hash';
    case ADDRESS_KEY:
      return 'Address';
    case CODE_KEY:
      return 'Code';
    case DESCRIPTION_KEY:
      return 'Description';
    case EXPIRY_HTLC:
      return 'Expiry CLTV';
    default:
      break;
  }
}