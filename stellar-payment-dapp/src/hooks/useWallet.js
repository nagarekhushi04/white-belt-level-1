import { getPublicKey, isConnected } from '@stellar/freighter-api'
import { useState, useCallback } from 'react'

/**
 * useWallet – manages Freighter wallet connection state
 *
 * Returns:
 *   publicKey       – string | null
 *   isConnecting    – boolean
 *   walletError     – string | null
 *   connectWallet   – () => Promise<void>
 *   disconnectWallet– () => void
 */
export function useWallet() {
    const [publicKey, setPublicKey] = useState(null)
    const [isConnecting, setIsConnecting] = useState(false)
    const [walletError, setWalletError] = useState(null)

    const connectWallet = useCallback(async () => {
        setIsConnecting(true)
        setWalletError(null)

        try {
            // Check if Freighter extension is available
            const connected = await isConnected()
            if (!connected) {
                setWalletError(
                    'Freighter not installed. Please install it at https://www.freighter.io'
                )
                return
            }

            const key = await getPublicKey()
            setPublicKey(key)
        } catch (err) {
            setWalletError(err?.message || 'Failed to connect wallet. Please try again.')
        } finally {
            setIsConnecting(false)
        }
    }, [])

    const disconnectWallet = useCallback(() => {
        setPublicKey(null)
        setWalletError(null)
    }, [])

    return {
        publicKey,
        isConnecting,
        walletError,
        connectWallet,
        disconnectWallet,
    }
}
