import { describe, it, expect } from 'vitest';
import { formatTimestamp } from './timestamp';

describe('formatTimestamp', () => {
  it('formats a Unix timestamp to a human-readable string', () => {
    const timestamp = new Date('2023-01-15T10:30:00Z').getTime();
    const result = formatTimestamp(timestamp);
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('handles epoch timestamp', () => {
    const result = formatTimestamp(0);
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('handles current timestamp', () => {
    const result = formatTimestamp(Date.now());
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });
});
