import { describe, it, expect } from 'vitest';
import { validateInternetIdentifier } from './internet-identifier';

describe('validateInternetIdentifier', () => {
  it('returns true for valid email-like identifiers', () => {
    expect(validateInternetIdentifier('user@example.com')).toBe(true);
    expect(validateInternetIdentifier('name@domain.co.uk')).toBe(true);
    expect(validateInternetIdentifier('hello@world.io')).toBe(true);
    expect(validateInternetIdentifier('test.user@sub.domain.com')).toBe(true);
  });

  it('returns false for invalid identifiers', () => {
    expect(validateInternetIdentifier('notanemail')).toBe(false);
    expect(validateInternetIdentifier('')).toBe(false);
    expect(validateInternetIdentifier('user@')).toBe(false);
    expect(validateInternetIdentifier('@domain.com')).toBe(false);
    expect(validateInternetIdentifier('user@domain')).toBe(false);
    expect(validateInternetIdentifier('@')).toBe(false);
    expect(validateInternetIdentifier('user@.com')).toBe(false);
    expect(validateInternetIdentifier('LNURL1...')).toBe(false);
    expect(validateInternetIdentifier('lnbc1...')).toBe(false);
    expect(validateInternetIdentifier('user@@domain.com')).toBe(false);
    expect(validateInternetIdentifier('user@domain..com')).toBe(false);
  });
});
