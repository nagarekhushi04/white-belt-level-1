// src/hooks/usePrices.js
import { useState, useEffect, useCallback } from 'react';
import { fetchTokenPrices } from '../utils/coingecko';

export function usePrices(addresses) {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCached, setIsCached] = useState(false);

  const loadPrices = useCallback(async () => {
    if (!addresses || addresses.length === 0) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await fetchTokenPrices(addresses);
      setPrices(result.prices);
      setIsCached(result.cached);
    } catch (err) {
      setError(err.message || 'Failed to fetch prices');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [addresses.join(',')]); // re-run only if address list changes

  useEffect(() => {
    loadPrices();
  }, [loadPrices]);

  return { prices, loading, error, isCached, refetch: loadPrices };
}
