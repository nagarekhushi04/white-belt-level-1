// src/utils/portfolio.js

/**
 * Calculates the total USD value of the portfolio and current allocations.
 * @param {Array<{address: string, symbol: string, balance: number}>} tokens 
 * @param {Record<string, number>} prices 
 * @returns {{ totalValue: number, allocations: Array<{name: string, value: number, pct: number}> }}
 */
export function calculatePortfolioValue(tokens, prices) {
  let totalValue = 0;
  const allocationsMap = [];

  tokens.forEach(token => {
    const rawPrice = prices[token.address.toLowerCase()] || 0;
    const value = token.balance * rawPrice;
    totalValue += value;

    allocationsMap.push({
      name: token.symbol,
      value: value,
      rawBalance: token.balance,
      price: rawPrice
    });
  });

  // Calculate percentages and format for chart
  const allocations = allocationsMap
    .filter(a => a.value > 0)
    .map(a => ({
      ...a,
      pct: totalValue > 0 ? (a.value / totalValue) * 100 : 0
    }))
    .sort((a, b) => b.value - a.value);

  return { totalValue, allocations };
}
