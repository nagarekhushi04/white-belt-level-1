// src/tests/priceCache.test.js
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { priceCache } from '../utils/priceCache';

describe('priceCache', () => {
  beforeEach(() => {
    localStorage.clear();
    // System time mock
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return null for non-existent key', () => {
    const result = priceCache.get('missing');
    expect(result).toBeNull();
  });

  it('should save and retrieve data within TTL', () => {
    const data = { eth: 3000 };
    priceCache.set('test_key', data);
    
    const result = priceCache.get('test_key');
    expect(result).toEqual({ data: { eth: 3000 }, cached: true });
  });

  it('should expire data after 60 seconds', () => {
    const data = { eth: 3000 };
    priceCache.set('test_key', data);
    
    // Advance time by 61 seconds
    vi.advanceTimersByTime(61000);
    
    const result = priceCache.get('test_key');
    expect(result).toBeNull();
    // Also should be cleared from localStorage
    expect(localStorage.getItem('test_key')).toBeNull();
  });
});
