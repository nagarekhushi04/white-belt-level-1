import { getPublicKey, isConnected, isAllowed, setAllowed } from '@stellar/freighter-api'
import { useState, useCallback } from 'react'

/**
 * useWallet – manages Freighter wallet connection state (compatible with @stellar/freighter-api v2.x)
 *
 * In v2.x:
 *   isConnected() → { isConnected: boolean }
 *   isAllowed()   → { isAllowed: boolean }
 *   setAllowed()  → { isAllowed: boolean }  (opens Freighter popup asking permission)
 *   getPublicKey()→ string  (empty string if permission not yet granted)
 *
 * Returns:
 *   publicKey        – string | null
 *   isConnecting     – boolean
 *   walletError      – string | null
 *   freighterMissing – boolean
 *   connectWallet    – () => Promise<void>
 *   connectDemo      – (key: string) => void
 *   disconnectWallet – () => void
 */
export function useWallet() {
    const [publicKey, setPublicKey] = useState(null)
    const [isConnecting, setIsConnecting] = useState(false)
    const [walletError, setWalletError] = useState(null)
    const [freighterMissing, setFreighterMissing] = useState(false)

    const connectWallet = useCallback(async () => {
        setIsConnecting(true)
        setWalletError(null)
        setFreighterMissing(false)

        try {
            // ── Step 1: Check if Freighter extension is installed ──
            // v2 API returns { isConnected: boolean }, v1 returns boolean
            const connResult = await isConnected()
            const isExt = typeof connResult === 'boolean'
                ? connResult
                : connResult?.isConnected ?? false

            if (!isExt) {
                setFreighterMissing(true)
                setWalletError(
                    'Freighter not installed. Please install it at https://www.freighter.io'
                )
                return
            }

            // ── Step 2: Check / request permission for this domain ──
            // v2 requires explicit permission per-domain via setAllowed()
            let permitted = false
            try {
                const allowedResult = await isAllowed()
                permitted = typeof allowedResult === 'boolean'
                    ? allowedResult
                    : allowedResult?.isAllowed ?? false
            } catch {
                permitted = false
            }

            if (!permitted) {
                // Opens the Freighter popup asking user to grant access
                try {
                    const grantResult = await setAllowed()
                    permitted = typeof grantResult === 'boolean'
                        ? grantResult
                        : grantResult?.isAllowed ?? false
                } catch (err) {
                    setWalletError(
                        err?.message || 'Permission denied. Please allow the app in Freighter and try again.'
                    )
                    return
                }
            }

            if (!permitted) {
                setWalletError('Permission denied. Please allow this app in Freighter and try again.')
                return
            }

            // ── Step 3: Get the public key ──
            const key = await getPublicKey()
            if (key && typeof key === 'string' && key.length > 0) {
                setPublicKey(key)
            } else {
                setWalletError(
                    'Could not retrieve your public key. Make sure Freighter is unlocked and try again.'
                )
            }
        } catch (err) {
            const msg = err?.message || ''
            if (msg.toLowerCase().includes('reject') || msg.toLowerCase().includes('declin')) {
                setWalletError('Connection rejected. Please approve the request in Freighter.')
            } else {
                setWalletError(msg || 'Failed to connect wallet. Please try again.')
            }
        } finally {
            setIsConnecting(false)
        }
    }, [])

    /** Demo mode – connect with a manually entered Stellar public key (read-only) */
    const connectDemo = useCallback((key) => {
        setPublicKey(key)
        setWalletError(null)
        setFreighterMissing(false)
    }, [])

    const disconnectWallet = useCallback(() => {
        setPublicKey(null)
        setWalletError(null)
        setFreighterMissing(false)
    }, [])

    return {
        publicKey,
        isConnecting,
        walletError,
        freighterMissing,
        connectWallet,
        connectDemo,
        disconnectWallet,
    }
}
