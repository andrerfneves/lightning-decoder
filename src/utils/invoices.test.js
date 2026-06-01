import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the bolt11 module to avoid infinite loop bug
vi.mock('../lib/bolt11', () => ({
  decode: vi.fn((invoice) => {
    if (invoice.startsWith('lnbcrt')) {
      return {
        complete: true,
        prefix: 'lnbcrt',
        coinType: 'regtest',
        satoshis: 500,
        millisatoshis: 500000,
        timestamp: 1672531200,
        tags: [
          { tagName: 'payment_hash', data: '0001020304050607080900010203040506070809000102030405060708090102' },
          { tagName: 'description', data: 'Regtest invoice' },
        ],
      };
    }
    if (invoice.startsWith('lnbc')) {
      return {
        complete: true,
        prefix: 'lnbc',
        coinType: 'bitcoin',
        satoshis: 1000,
        millisatoshis: 1000000,
        timestamp: 1672531200,
        timestampString: '2023-01-01T00:00:00.000Z',
        tags: [
          { tagName: 'payment_hash', data: '0001020304050607080900010203040506070809000102030405060708090102' },
          { tagName: 'description', data: 'Test invoice' },
        ],
      };
    }
    if (invoice.startsWith('lntbs')) {
      return {
        complete: true,
        prefix: 'lntbs',
        coinType: 'signet',
        satoshis: 500,
        millisatoshis: 500000,
        timestamp: 1672531200,
        tags: [
          { tagName: 'payment_hash', data: '0001020304050607080900010203040506070809000102030405060708090102' },
          { tagName: 'description', data: 'Signet invoice' },
        ],
      };
    }
    if (invoice.startsWith('lntb')) {
      return {
        complete: true,
        prefix: 'lntb',
        coinType: 'testnet',
        satoshis: 500,
        millisatoshis: 500000,
        timestamp: 1672531200,
        tags: [
          { tagName: 'payment_hash', data: '0001020304050607080900010203040506070809000102030405060708090102' },
          { tagName: 'description', data: 'Testnet invoice' },
        ],
      };
    }
    throw new Error('Unknown invoice format');
  }),
}));

// A valid bech32-encoded LNURL that decodes to a URL
// This is "https://service.com/api?q=3fc3645b439ce8e7f2553a69e5267081d96dcd340693afabe04be7b0ccd178df"
const VALID_LNURL_BECH32 = 'LNURL1DP68GURN8GHJ7UM9WFMXJCM99E3K7MF0V9CXJ0M385EKVCENXC6R2C35XVUKXEFCV5MKVV34X5EKZD3EV56NYD3HXQURZEPEXEJXXEPNXSCRVWFNV9NXZCN9XQ6XYEFHVGCXXCMYXYMNSERXFQ5FNS';

const VALID_LNURL_BECH32_LOWER = VALID_LNURL_BECH32.toLowerCase();

const VALID_BOLT11 = 'lnbc10n1p3pjhwupp5rdug4w2gnvm82c6q7wkdr83e5ngyxcvg2sn0e8mtnsw42lf2c5tsdqqcqzpgxqyz5vqsp5usryjx2xrkntysw8rk9qj4kt0l7jx2mv5al3gpjctq7v385txnq9qyyssqta2j5du63740n5gr3xmd4d2m7ur9de35xlvk2x4qaqcytldp6uqslz0up3jyvgrd7d732fthl43wryungq4khc3xfwsqv58czh6l22qph2j28';

describe('parseInvoice', () => {
  beforeEach(() => {
    // Mock fetch globally for LNURL and Lightning Address tests
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns null for empty input', async () => {
    const { parseInvoice } = await import('./invoices');
    expect(await parseInvoice(null)).toBeNull();
    expect(await parseInvoice('')).toBeNull();
  });

  describe('lightning address detection', () => {
    it('returns error for unregistered lightning address', async () => {
      globalThis.fetch.mockRejectedValueOnce(new Error('Not found'));

      const { parseInvoice } = await import('./invoices');
      const result = await parseInvoice('user@example.com');

      expect(result).toEqual({
        data: null,
        error: 'This identifier does not support Lightning Address yet.',
        isLNURL: false,
        isLNAddress: true,
      });
    });

    it('returns data for valid lightning address', async () => {
      const mockResponse = {
        tag: 'payRequest',
        callback: 'https://example.com/.well-known/lnurlp/user',
        minSendable: 1000,
        maxSendable: 100000,
        metadata: '[["text/plain","Test user"]]',
      };
      globalThis.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse),
      });

      const { parseInvoice } = await import('./invoices');
      const result = await parseInvoice('user@example.com');

      expect(result.isLNURL).toBe(true);
      expect(result.isLNAddress).toBe(true);
      expect(result.data).toMatchObject({
        ...mockResponse,
        domain: 'example.com',
        username: 'user',
      });
    });

    it('returns the service reason when lightning address response is an error', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ status: 'ERROR', reason: 'User not found' }),
      });

      const { parseInvoice } = await import('./invoices');
      const result = await parseInvoice('missing@example.com');

      expect(result).toEqual({
        data: null,
        error: 'User not found',
        isLNURL: false,
        isLNAddress: true,
      });
    });
  });

  describe('lightning: prefix', () => {
    it('strips lightning: prefix from LNURL', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ tag: 'payRequest' }),
      });

      const { parseInvoice } = await import('./invoices');
      const result = await parseInvoice(`lightning:${VALID_LNURL_BECH32_LOWER}`);

      expect(result.isLNURL).toBe(true);
      expect(result.data).toBeDefined();
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://service.com/api?q=3fc3645b439ce8e7f2553a69e5267081d96dcd340693afabe04be7b0ccd178df'
      );
    });

    it('strips lightning: prefix from BOLT11', async () => {
      const { parseInvoice } = await import('./invoices');
      const result = await parseInvoice(`lightning:${VALID_BOLT11}`);

      expect(result.isLNURL).toBe(false);
      expect(result.data).toBeDefined();
      expect(result.data.satoshis).toBe(1000);
    });

    it.each([
      ['testnet/testnet4', 'lntb1pjtestnet', 'testnet'],
      ['signet', 'lntbs1pjsignet', 'signet'],
      ['regtest', 'lnbcrt1pjregtest', 'regtest'],
    ])('strips lightning: prefix from BOLT11 %s invoice strings', async (_, invoice, coinType) => {
      const { parseInvoice } = await import('./invoices');
      const result = await parseInvoice(`lightning:${invoice}`);

      expect(result.isLNURL).toBe(false);
      expect(result.data).toBeDefined();
      expect(result.data.coinType).toBe(coinType);
    });

    it('does not strip lightning: when it appears inside an unrelated string', async () => {
      const { parseInvoice } = await import('./invoices');
      const result = await parseInvoice(`not-a-prefix-lightning:${VALID_BOLT11}`);

      expect(result).toEqual({
        data: null,
        isLNURL: false,
      });
    });
  });

  describe('lightning= fallback param (LUD-01)', () => {
    it('strips lightning= param from URL', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ tag: 'payRequest' }),
      });

      const { parseInvoice } = await import('./invoices');
      const result = await parseInvoice(
        `https://example.com/giftcard/redeem?id=123&lightning=${VALID_LNURL_BECH32}`
      );

      expect(result.isLNURL).toBe(true);
      expect(result.data).toBeDefined();
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://service.com/api?q=3fc3645b439ce8e7f2553a69e5267081d96dcd340693afabe04be7b0ccd178df'
      );
    });

    it('strips lightning= param and stops at next &', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ tag: 'payRequest' }),
      });

      const { parseInvoice } = await import('./invoices');
      const result = await parseInvoice(
        `https://service.com/?lightning=${VALID_LNURL_BECH32}&foo=bar&baz=123`
      );

      expect(result.isLNURL).toBe(true);
      expect(result.data).toBeDefined();
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://service.com/api?q=3fc3645b439ce8e7f2553a69e5267081d96dcd340693afabe04be7b0ccd178df'
      );
    });

    it('handles lightning= without additional params', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ tag: 'payRequest' }),
      });

      const { parseInvoice } = await import('./invoices');
      const result = await parseInvoice(
        `lightning=${VALID_LNURL_BECH32_LOWER}`
      );

      expect(result.isLNURL).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('lnurl: prefix', () => {
    it('strips lnurl: prefix', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ tag: 'payRequest' }),
      });

      const { parseInvoice } = await import('./invoices');
      const result = await parseInvoice(`lnurl:${VALID_LNURL_BECH32_LOWER}`);

      expect(result.isLNURL).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('does not strip lnurl: when it appears inside an unrelated string', async () => {
      const { parseInvoice } = await import('./invoices');
      const result = await parseInvoice(`not-a-prefix-lnurl:${VALID_LNURL_BECH32_LOWER}`);

      expect(result).toEqual({
        data: null,
        isLNURL: false,
      });
      expect(globalThis.fetch).not.toHaveBeenCalled();
    });
  });

  describe('raw inputs (no prefix)', () => {
    it('handles raw LNURL bech32 string', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ tag: 'payRequest' }),
      });

      const { parseInvoice } = await import('./invoices');
      const result = await parseInvoice(VALID_LNURL_BECH32_LOWER);

      expect(result.isLNURL).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('handles raw BOLT11 invoice string', async () => {
      const { parseInvoice } = await import('./invoices');
      const result = await parseInvoice(VALID_BOLT11);

      expect(result.isLNURL).toBe(false);
      expect(result.data).toBeDefined();
      expect(result.data.satoshis).toBe(1000);
    });

    it.each([
      ['testnet/testnet4', 'lntb1pjtestnet', 'testnet'],
      ['signet', 'lntbs1pjsignet', 'signet'],
      ['regtest', 'lnbcrt1pjregtest', 'regtest'],
    ])('handles raw BOLT11 %s invoice strings', async (_, invoice, coinType) => {
      const { parseInvoice } = await import('./invoices');
      const result = await parseInvoice(invoice);

      expect(result.isLNURL).toBe(false);
      expect(result.data).toBeDefined();
      expect(result.data.coinType).toBe(coinType);
    });
  });

  describe('invalid inputs', () => {
    it('returns error for garbage input', async () => {
      const { parseInvoice } = await import('./invoices');
      const result = await parseInvoice('garbageinputthatisnothing');

      expect(result).toEqual({
        data: null,
        isLNURL: false,
      });
    });

    it('returns null for undefined input', async () => {
      const { parseInvoice } = await import('./invoices');
      expect(await parseInvoice(undefined)).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('handles leading/trailing whitespace', async () => {
      const { parseInvoice } = await import('./invoices');
      const result = await parseInvoice(`  ${VALID_BOLT11}  `);

      expect(result.isLNURL).toBe(false);
      expect(result.data).toBeDefined();
      expect(result.data.satoshis).toBe(1000);
    });


    it('handles uppercase LNURL', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ tag: 'payRequest' }),
      });

      const { parseInvoice } = await import('./invoices');
      const result = await parseInvoice(VALID_LNURL_BECH32);

      expect(result.isLNURL).toBe(true);
      expect(result.data).toBeDefined();
    });
  });
});
