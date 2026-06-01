import { describe, it, expect } from 'vitest';
import { formatDetailsKey } from './keys';

describe('formatDetailsKey', () => {
  it('returns formatted label for known keys', () => {
    const cases = [
      { key: 'coinType', expected: 'Chain' },
      { key: 'payeeNodeKey', expected: 'Payee Pub Key' },
      { key: 'expire_time', expected: 'Expire Time' },
      { key: 'paymentRequest', expected: 'Invoice' },
      { key: 'prefix', expected: 'Prefix' },
      { key: 'recoveryFlag', expected: 'Recovery Flag' },
      { key: 'satoshis', expected: 'Amount (Satoshis)' },
      { key: 'millisatoshis', expected: 'Amount (Millisatoshis)' },
      { key: 'signature', expected: 'Transaction Signature' },
      { key: 'timestampString', expected: 'Timestamp String' },
      { key: 'wordsTemp', expected: 'Words Temp' },
      { key: 'purpose_commit_hash', expected: 'Commit Hash' },
      { key: 'payment_hash', expected: 'Payment Hash' },
      { key: 'fallback_address', expected: 'Fallback Address' },
      { key: 'addressHash', expected: 'Address Hash' },
      { key: 'address', expected: 'Address' },
      { key: 'code', expected: 'Code' },
      { key: 'description', expected: 'Description' },
      { key: 'expiry_htlc', expected: 'Expiry CLTV' },
      { key: 'timeExpireDateString', expected: 'Time Expire Date String' },
      { key: 'timeExpireDate', expected: 'Time Expire Date' },
      { key: 'timestamp', expected: 'Timestamp' },
      { key: 'min_final_cltv_expiry', expected: 'Minimum Final CLTV Expiry' },
      { key: 'unknownTag', expected: 'Unknown Tag' },
      { key: 'routing_info', expected: 'Routing Info' },
      { key: 'tagCode', expected: 'Tag Code' },
      { key: 'words', expected: 'Tag Words' },
      { key: 'cltv_expiry_delta', expected: 'CLTV Expiry Delta' },
      { key: 'fee_base_msat', expected: 'Fee Base (MSats)' },
      { key: 'fee_proportional_millionths', expected: 'Tag Words' },
      { key: 'pubkey', expected: 'Public Key' },
      { key: 'short_channel_id', expected: 'Short Channel ID' },
      { key: 'callback', expected: 'Callback URL' },
      { key: 'commentAllowed', expected: 'Comment Allowed (Chars)' },
      { key: 'maxSendable', expected: 'Max Sendable (MSats)' },
      { key: 'minSendable', expected: 'Min Sendable (MSats)' },
      { key: 'minWithdrawable', expected: 'Min Withdrawable (MSats)' },
      { key: 'maxWithdrawable', expected: 'Max Withdrawable (MSats)' },
      { key: 'tag', expected: 'LNURL Tag/Type' },
      { key: 'metadata', expected: 'LNURL Metadata' },
      { key: 'k1', expected: 'K1' },
      { key: 'defaultDescription', expected: 'Description' },
      { key: 'domain', expected: 'Domain' },
      { key: 'username', expected: 'Username' },
    ];

    cases.forEach(({ key, expected }) => {
      expect(formatDetailsKey(key)).toBe(expected);
    });
  });

  it('humanizes unknown keys instead of rendering them as errors', () => {
    expect(formatDetailsKey('allowsNostr')).toBe('Allows Nostr');
    expect(formatDetailsKey('nostrPubkey')).toBe('Nostr Pubkey');
    expect(formatDetailsKey('payer-data')).toBe('Payer Data');
    expect(formatDetailsKey('random_field')).toBe('Random Field');
  });

  it('returns formatted label for BOLT12 keys', () => {
    const bolt12Cases = [
      { key: 'type', expected: 'Type' },
      { key: 'chains', expected: 'Chains' },
      { key: 'currency', expected: 'Currency' },
      { key: 'amount', expected: 'Amount (MSats)' },
      { key: 'features', expected: 'Features' },
      { key: 'absoluteExpiry', expected: 'Absolute Expiry' },
      { key: 'paths', expected: 'Paths' },
      { key: 'issuer', expected: 'Issuer' },
      { key: 'quantityMax', expected: 'Max Quantity' },
      { key: 'issuerId', expected: 'Issuer ID' },
      { key: 'chain', expected: 'Chain' },
      { key: 'quantity', expected: 'Quantity' },
      { key: 'payerId', expected: 'Payer ID' },
      { key: 'payerNote', expected: 'Payer Note' },
      { key: 'signature', expected: 'Transaction Signature' },
      { key: 'blindedPayInfo', expected: 'Blinded Pay Info' },
      { key: 'createdAt', expected: 'Created At' },
      { key: 'relativeExpiry', expected: 'Relative Expiry (seconds)' },
      { key: 'paymentHash', expected: 'Payment Hash' },
      { key: 'fallbacks', expected: 'Fallbacks' },
      { key: 'nodeId', expected: 'Node ID' },
      { key: 'metadata', expected: 'LNURL Metadata' },
    ];

    bolt12Cases.forEach(({ key, expected }) => {
      expect(formatDetailsKey(key)).toBe(expected);
    });
  });
});
