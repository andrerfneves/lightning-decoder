// Key Formatting Utilities
import {
  COIN_TYPE_KEY,
  PAYEE_NODE_KEY,
  PAYMENT_REQUEST_KEY,
  PREFIX_KEY,
  TIMESTAMP_STRING_KEY,
  TIMESTAMP_KEY,
  SATOSHIS_KEY,
  SIGNATURE_KEY,
  RECOVERY_FLAG_KEY,
  COMMIT_HASH_KEY,
  PAYMENT_HASH_KEY,
  FALLBACK_ADDRESS_KEY,
  ADDRESS_HASH_KEY,
  ADDRESS_KEY,
  MILLISATOSHIS_KEY,
  CODE_KEY,
  DESCRIPTION_KEY,
  EXPIRY_HTLC,
  TIME_EXPIRE_DATE,
  WORDS_TEMP_KEY,
  EXPIRE_TIME,
  TIME_EXPIRE_DATE_STRING,
  MIN_FINAL_CLTV_EXPIRY,
} from '../constants/keys';

export const formatDetailsKey = (key: string) => {
  switch (key) {
    case COIN_TYPE_KEY:
      return 'Chain';
    case PAYEE_NODE_KEY:
      return 'Payee Pub Key';
    case EXPIRE_TIME:
      return 'Expire Time';
    case PAYMENT_REQUEST_KEY:
      return 'Invoice';
    case PREFIX_KEY:
      return 'Prefix';
    case RECOVERY_FLAG_KEY:
      return 'Recovery Flag';
    case SATOSHIS_KEY:
      return 'Amount (Satoshis)';
    case MILLISATOSHIS_KEY:
      return 'Amount (Millisatoshis)';
    case SIGNATURE_KEY:
      return 'Transaction Signature';
    case TIMESTAMP_STRING_KEY:
      return 'Timestamp String';
    case WORDS_TEMP_KEY:
      return 'Words Temp';
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
    case TIME_EXPIRE_DATE_STRING:
      return 'Time Expire Date String';
    case TIME_EXPIRE_DATE:
      return 'Time Expire Date';
    case TIMESTAMP_KEY:
      return 'Timestamp';
    case MIN_FINAL_CLTV_EXPIRY:
      return 'Minimum Final CLTV Expiry';
    default:
      break;
  }
}