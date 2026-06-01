import { describe, expect, it, vi } from 'vitest'

const secp = vi.hoisted(() => {
  const publicKeyHex = `02${'11'.repeat(32)}`

  return {
    publicKey: {
      equals: (other) => other && other.toString('hex') === publicKeyHex,
      toString: (encoding) => encoding === 'hex' ? publicKeyHex : publicKeyHex,
    },
    signature: {
      toString: (encoding) => encoding === 'hex' ? '00'.repeat(64) : '00'.repeat(64),
    },
  }
})

vi.mock('secp256k1', () => ({
  default: {
    privateKeyVerify: vi.fn(() => true),
    publicKeyCreate: vi.fn(() => secp.publicKey),
    publicKeyVerify: vi.fn(() => true),
    recover: vi.fn(() => secp.publicKey),
    sign: vi.fn(() => ({
      recovery: 0,
      signature: secp.signature,
    })),
  },
}))

import { decode, encode, sign } from './bolt11'

const PRIVATE_KEY = '0000000000000000000000000000000000000000000000000000000000000001'
const PAYMENT_HASH = '0001020304050607080900010203040506070809000102030405060708090102'
const FALLBACK_HASH = '00112233445566778899aabbccddeeff00112233'

const makeInvoice = (coinType, tags = []) => {
  const unsigned = encode({
    coinType,
    timestamp: 1672531200,
    millisatoshis: '1000000',
    tags: [
      { tagName: 'payment_hash', data: PAYMENT_HASH },
      { tagName: 'description', data: `${coinType} invoice` },
      ...tags,
    ],
  }, false)

  return sign(unsigned, PRIVATE_KEY).paymentRequest
}

describe('BOLT11 bitcoin networks', () => {
  it('decodes signet invoices with testnet-compatible fallback addresses', () => {
    const invoice = makeInvoice('signet', [
      {
        tagName: 'fallback_address',
        data: {
          code: 0,
          addressHash: FALLBACK_HASH,
        },
      },
    ])

    const decoded = decode(invoice)
    const fallbackAddress = decoded.tags.find(tag => tag.tagName === 'fallback_address')

    expect(decoded.prefix).toMatch(/^lntbs/)
    expect(decoded.coinType).toBe('signet')
    expect(fallbackAddress.data.address).toMatch(/^tb1/)
  })

  it('decodes regtest invoices', () => {
    const invoice = makeInvoice('regtest')
    const decoded = decode(invoice)

    expect(decoded.prefix).toMatch(/^lnbcrt/)
    expect(decoded.coinType).toBe('regtest')
  })

  it('encodes testnet4 as a testnet-compatible BOLT11 invoice', () => {
    const invoice = makeInvoice('testnet4')
    const decoded = decode(invoice)

    expect(decoded.prefix).toMatch(/^lntb/)
    expect(decoded.coinType).toBe('testnet')
  })
})
