import { useState, useEffect, useCallback } from 'react'
import { fetchBalance } from '../utils/stellar'

/**
 * useBalance – fetches and refreshes XLM balance for a given publicKey.
 *
 * Returns:
 *   balance          – string | null
 *   isLoadingBalance – boolean
 *   balanceError     – string | null
 *   refreshBalance   – () => void
 */
export function useBalance(publicKey) {
    const [balance, setBalance] = useState(null)
    const [isLoadingBalance, setIsLoadingBalance] = useState(false)
    const [balanceError, setBalanceError] = useState(null)

    const loadBalance = useCallback(async () => {
        if (!publicKey) {
            setBalance(null)
            setBalanceError(null)
            return
        }

        setIsLoadingBalance(true)
        setBalanceError(null)

        try {
            const bal = await fetchBalance(publicKey)
            setBalance(bal)
        } catch (err) {
            setBalanceError(err?.message || 'Failed to fetch balance')
            setBalance(null)
        } finally {
            setIsLoadingBalance(false)
        }
    }, [publicKey])

    // Auto-fetch when publicKey changes
    useEffect(() => {
        loadBalance()
    }, [loadBalance])

    return {
        balance,
        isLoadingBalance,
        balanceError,
        refreshBalance: loadBalance,
    }
}
