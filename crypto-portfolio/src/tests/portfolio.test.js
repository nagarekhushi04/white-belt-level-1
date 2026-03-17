// src/tests/portfolio.test.js
import { describe, it, expect } from 'vitest';
import { calculatePortfolioValue } from '../utils/portfolio';

describe('calculatePortfolioValue', () => {
  it('should calculate total value correctly', () => {
    const tokens = [
      { address: 'eth', symbol: 'ETH', balance: 2 },
      { address: 'usdc', symbol: 'USDC', balance: 1000 }
    ];
    const prices = {
      eth: 3500,
      usdc: 1
    };

    const { totalValue } = calculatePortfolioValue(tokens, prices);
    expect(totalValue).toBe(8000); // 2*3500 + 1000*1
  });

  it('should calculate allocations with correct percentages', () => {
    const tokens = [
      { address: 'a', symbol: 'A', balance: 1 },
      { address: 'b', symbol: 'B', balance: 3 }
    ];
    const prices = { a: 100, b: 100 };

    const { allocations } = calculatePortfolioValue(tokens, prices);
    expect(allocations.length).toBe(2);
    
    // B should be first because 300 > 100
    expect(allocations[0].name).toBe('B');
    expect(allocations[0].pct).toBe(75); // 300/400
    
    expect(allocations[1].name).toBe('A');
    expect(allocations[1].pct).toBe(25); // 100/400
  });

  it('should handle zero balances gracefully', () => {
    const tokens = [{ address: 'eth', symbol: 'ETH', balance: 0 }];
    const prices = { eth: 3500 };

    const { totalValue, allocations } = calculatePortfolioValue(tokens, prices);
    expect(totalValue).toBe(0);
    expect(allocations.length).toBe(0); // Filters out zero value allocations
  });
});
