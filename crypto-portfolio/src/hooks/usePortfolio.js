// src/hooks/usePortfolio.js
import { useMemo } from 'react';
import { calculatePortfolioValue } from '../utils/portfolio';
import { useWallet } from './useWallet';
import { usePrices } from './usePrices';

export function usePortfolio() {
  const { account, isDemo, tokens, loadingBalances, addToken, removeToken, connect, disconnect } = useWallet();
  
  // Extract addresses needed for prices
  const addresses = useMemo(() => tokens.map(t => t.address), [tokens]);
  const { prices, loading: loadingPrices, error: priceError, isCached, refetch } = usePrices(addresses);

  // Combine balances and prices
  const { totalValue, allocations } = useMemo(() => {
    return calculatePortfolioValue(tokens, prices);
  }, [tokens, prices]);

  return {
    account,
    isDemo,
    tokens,
    addToken,
    removeToken,
    connect,
    disconnect,
    prices,
    totalValue,
    allocations,
    loading: loadingBalances || loadingPrices,
    error: priceError,
    isCached,
    refetch,
  };
}
