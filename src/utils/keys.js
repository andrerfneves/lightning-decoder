// Key Formatting Utilities
import {
  CODE_KEY,
  PREFIX_KEY,
  PUBKEY_KEY,
  EXPIRE_TIME,
  ADDRESS_KEY,
  EXPIRY_HTLC,
  SATOSHIS_KEY,
  TAG_CODE_KEY,
  CALLBACK_KEY,
  LNURL_K1_KEY,
  LNURL_TAG_KEY,
  TAG_WORDS_KEY,
  SIGNATURE_KEY,
  COIN_TYPE_KEY,
  TIMESTAMP_KEY,
  WORDS_TEMP_KEY,
  PAYEE_NODE_KEY,
  DESCRIPTION_KEY,
  COMMIT_HASH_KEY,
  UNKNOWN_TAG_KEY,
  MAX_SENDABLE_KEY,
  MIN_SENDABLE_KEY,
  ROUTING_INFO_KEY,
  PAYMENT_HASH_KEY,
  ADDRESS_HASH_KEY,
  TIME_EXPIRE_DATE,
  RECOVERY_FLAG_KEY,
  MILLISATOSHIS_KEY,
  FEE_BASE_MSAT_KEY,
  SHORT_CHANNEL_KEY,
  LNURL_METADATA_KEY,
  COMMENT_ALLOWED_KEY,
  PAYMENT_REQUEST_KEY,
  MAX_WITHDRAWABLE_KEY,
  MIN_WITHDRAWABLE_KEY,
  FEE_PROPORTIONAL_KEY,
  FALLBACK_ADDRESS_KEY,
  TIMESTAMP_STRING_KEY,
  MIN_FINAL_CLTV_EXPIRY,
  CLTV_EXPIRY_DELTA_KEY,
  TIME_EXPIRE_DATE_STRING,
  DEFAULT_DESCRIPTION_KEY,
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
    case UNKNOWN_TAG_KEY:
      return 'Unknown Tag';
    case ROUTING_INFO_KEY:
      return 'Routing Info';
    case TAG_CODE_KEY:
      return 'Tag Code';
    case TAG_WORDS_KEY:
      return 'Tag Words';
    case CLTV_EXPIRY_DELTA_KEY:
      return 'CLTV Expiry Delta';
    case FEE_BASE_MSAT_KEY:
      return 'Fee Base (MSats)';
    case FEE_PROPORTIONAL_KEY:
      return 'Tag Words';
    case PUBKEY_KEY:
      return 'Public Key';
    case SHORT_CHANNEL_KEY:
      return 'Short Channel ID';
    case CALLBACK_KEY:
      return 'Callback URL';
    case COMMENT_ALLOWED_KEY:
      return 'Comment Allowed (Chars)';
    case MAX_SENDABLE_KEY:
      return 'Max Sendable (MSats)';
    case MIN_SENDABLE_KEY:
      return 'Min Sendable (MSats)';
    case MAX_WITHDRAWABLE_KEY:
      return 'Max Withdrawable (MSats)';
    case MIN_WITHDRAWABLE_KEY:
      return 'Min Withdrawable (MSats)';
    case LNURL_TAG_KEY:
      return 'LNURL Tag/Type';
    case LNURL_METADATA_KEY:
      return 'LNURL Metadata';
    case LNURL_K1_KEY:
      return 'K1';
    case DEFAULT_DESCRIPTION_KEY:
      return 'Description';
    default:
      break;
  }
}
