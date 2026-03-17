// src/tests/coingecko.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchTokenPrices } from '../utils/coingecko';
import { priceCache } from '../utils/priceCache';

// Mock global fetch
global.fetch = vi.fn();

describe('fetchTokenPrices', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    priceCache.clear('cg_prices_eth');
    priceCache.clear('cg_prices_0xusdc,eth');
  });

  it('should fetch ETH price successfully', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ethereum: { usd: 3500 } })
    });

    const { prices, cached } = await fetchTokenPrices(['eth']);
    
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(prices).toHaveProperty('eth', 3500);
    expect(cached).toBe(false);
  });

  it('should use mocked fallback if fetch fails', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));

    const { prices, cached } = await fetchTokenPrices(['eth']);
    
    expect(prices).toHaveProperty('eth');
    expect(prices.eth).toBeGreaterThan(0); // should be mock price
    expect(cached).toBe(false);
  });

  it('should return cached data if available', async () => {
    priceCache.set('cg_prices_eth', { eth: 4000 });

    const { prices, cached } = await fetchTokenPrices(['eth']);
    
    expect(global.fetch).not.toHaveBeenCalled();
    expect(prices.eth).toBe(4000);
    expect(cached).toBe(true);
  });
});
