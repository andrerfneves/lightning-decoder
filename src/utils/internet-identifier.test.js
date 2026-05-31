import { describe, it, expect } from 'vitest';
import { validateInternetIdentifier } from './internet-identifier';

describe('validateInternetIdentifier', () => {
  it('returns true for valid email-like identifiers', () => {
    expect(validateInternetIdentifier('user@example.com')).toBe(true);
    expect(validateInternetIdentifier('name@domain.co.uk')).toBe(true);
  });

  it('returns false for invalid identifiers', () => {
    expect(validateInternetIdentifier('notanemail')).toBe(false);
    expect(validateInternetIdentifier('')).toBe(false);
    expect(validateInternetIdentifier('user@')).toBe(false);
    expect(validateInternetIdentifier('@domain.com')).toBe(false);
  });
});
