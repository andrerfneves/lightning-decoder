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
  LN_ADDRESS_DOMAIN_KEY,
  LN_ADDRESS_USERNAME_KEY,
  TIME_EXPIRE_DATE_STRING,
  DEFAULT_DESCRIPTION_KEY,
  BOLT12_TYPE_KEY,
  BOLT12_CHAINS_KEY,
  BOLT12_METADATA_KEY,
  BOLT12_CURRENCY_KEY,
  BOLT12_AMOUNT_KEY,
  BOLT12_FEATURES_KEY,
  BOLT12_ABSOLUTE_EXPIRY_KEY,
  BOLT12_PATHS_KEY,
  BOLT12_ISSUER_KEY,
  BOLT12_QUANTITY_MAX_KEY,
  BOLT12_ISSUER_ID_KEY,
  BOLT12_CHAIN_KEY,
  BOLT12_QUANTITY_KEY,
  BOLT12_PAYER_ID_KEY,
  BOLT12_PAYER_NOTE_KEY,
  BOLT12_SIGNATURE_KEY,
  BOLT12_BLINDED_PAY_INFO_KEY,
  BOLT12_CREATED_AT_KEY,
  BOLT12_RELATIVE_EXPIRY_KEY,
  BOLT12_PAYMENT_HASH_KEY,
  BOLT12_FALLBACKS_KEY,
  BOLT12_NODE_ID_KEY,
} from '../constants/keys';

const humanizeKey = (key) => key
  .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  .replace(/[_-]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.slice(1));

export const formatDetailsKey = (key) => {
  switch (key) {
    case COIN_TYPE_KEY:
      return 'Chain';
    case PAYEE_NODE_KEY:
      return 'Payee Pub Key';
    case EXPIRE_TIME:
      return 'Expire Time (Seconds)';
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
      return 'Fee Base (millisats)';
    case FEE_PROPORTIONAL_KEY:
      return 'Fee Proportional (millionths)';
    case PUBKEY_KEY:
      return 'Public Key';
    case SHORT_CHANNEL_KEY:
      return 'Short Channel ID';
    case CALLBACK_KEY:
      return 'Callback URL';
    case COMMENT_ALLOWED_KEY:
      return 'Comment Allowed (# of chars)';
    case MAX_SENDABLE_KEY:
      return 'Max Sendable (millisats)';
    case MIN_SENDABLE_KEY:
      return 'Min Sendable (millisats)';
    case MAX_WITHDRAWABLE_KEY:
      return 'Max Withdrawable (millisats)';
    case MIN_WITHDRAWABLE_KEY:
      return 'Min Withdrawable (millisats)';
    case LNURL_TAG_KEY:
      return 'LNURL Type';
    case LNURL_METADATA_KEY:
      return 'Metadata';
    case LNURL_K1_KEY:
      return 'K1';
    case DEFAULT_DESCRIPTION_KEY:
      return 'Description';
    case LN_ADDRESS_DOMAIN_KEY:
      return 'Domain';
    case LN_ADDRESS_USERNAME_KEY:
      return 'Username';
    // BOLT12 Keys
    case BOLT12_TYPE_KEY:
      return 'Type';
    case BOLT12_CHAINS_KEY:
      return 'Chains';
    case BOLT12_METADATA_KEY:
      return 'Metadata';
    case BOLT12_CURRENCY_KEY:
      return 'Currency';
    case BOLT12_AMOUNT_KEY:
      return 'Amount (millisats)';
    case BOLT12_FEATURES_KEY:
      return 'Features';
    case BOLT12_ABSOLUTE_EXPIRY_KEY:
      return 'Absolute Expiry';
    case BOLT12_PATHS_KEY:
      return 'Paths';
    case BOLT12_ISSUER_KEY:
      return 'Issuer';
    case BOLT12_QUANTITY_MAX_KEY:
      return 'Max Quantity';
    case BOLT12_ISSUER_ID_KEY:
      return 'Issuer ID';
    case BOLT12_CHAIN_KEY:
      return 'Chain';
    case BOLT12_QUANTITY_KEY:
      return 'Quantity';
    case BOLT12_PAYER_ID_KEY:
      return 'Payer ID';
    case BOLT12_PAYER_NOTE_KEY:
      return 'Payer Note';
    case BOLT12_SIGNATURE_KEY:
      return 'Signature';
    case BOLT12_BLINDED_PAY_INFO_KEY:
      return 'Blinded Pay Info';
    case BOLT12_CREATED_AT_KEY:
      return 'Created At';
    case BOLT12_RELATIVE_EXPIRY_KEY:
      return 'Relative Expiry (seconds)';
    case BOLT12_PAYMENT_HASH_KEY:
      return 'Payment Hash';
    case BOLT12_FALLBACKS_KEY:
      return 'Fallbacks';
    case BOLT12_NODE_ID_KEY:
      return 'Node ID';
    default:
      return humanizeKey(key);
  }
}
