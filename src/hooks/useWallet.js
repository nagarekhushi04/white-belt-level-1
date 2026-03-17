import { useState, useCallback, useEffect } from 'react'
import { getAddress, requestAccess, signTransaction, isConnected, isAllowed } from '@stellar/freighter-api'
import { Networks } from '@stellar/stellar-sdk'

import { parseWalletError } from '../utils/errorHandler'

let xbullExtension = null
let xbullWeb = null

async function getXbull(preferredTarget) {
    const { xBullWalletConnect } = await import('@creit.tech/xbull-wallet-connect')
    return new xBullWalletConnect({ preferredTarget })
}

async function signWithFreighter(xdr) {
    try {
        // Freighter v3 returns an object { signedTxXdr, error }
        const res = await signTransaction(xdr, { networkPassphrase: Networks.TESTNET })
        
        if (typeof res === 'string') return res
        if (res?.signedTxXdr) return res.signedTxXdr
        if (res?.signedXDR) return res.signedXDR
        if (res?.xdr) return res.xdr
        
        if (res?.error) {
             throw new Error(res.error)
        }

        return res
    } catch (err) {
        console.error('Freighter signing failed:', err)
        const msg = (err?.message || err?.toString() || '').toLowerCase()
        if (msg.includes('user') || msg.includes('reject') || msg.includes('cancel') || msg.includes('decline')) {
             throw new Error('USER_REJECTED')
        }
        
        // Fallback for older patterns if any
        try {
            const resLegacy = await signTransaction(xdr, Networks.TESTNET)
            if (typeof resLegacy === 'string') return resLegacy
            if (resLegacy?.signedTxXdr) return resLegacy.signedTxXdr
            return resLegacy
        } catch (innerErr) {
            throw err
        }
    }
}

async function connectXbull(preferredTarget) {
    if (preferredTarget === 'extension') {
        if (!xbullExtension) xbullExtension = await getXbull('extension')
        const address = await xbullExtension.connect()
        return { address, walletId: 'xbull-extension' }
    }

    if (!xbullWeb) xbullWeb = await getXbull('web')
    const address = await xbullWeb.connect()
    return { address, walletId: 'xbull-web' }
}

async function signWithXbull(walletId, xdr, publicKey) {
    const connector = walletId === 'xbull-extension' ? xbullExtension : xbullWeb
    if (!connector) throw new Error('Wallet not connected')
    return await connector.sign({ xdr, publicKey, network: Networks.TESTNET })
}

export function useWallet(setGlobalError) {
    const [publicKey, setPublicKey] = useState(null)
    const [isConnecting, setIsConnecting] = useState(false)
    const [walletError, setWalletError] = useState(null)
    const [connectedWalletId, setConnectedWalletId] = useState(null)
    const [isAlive, setIsAlive] = useState(false)

    // Check if connection is still alive every 30s
    useEffect(() => {
        if (!publicKey) {
            setIsAlive(false)
            return
        }

        const checkConnection = async () => {
            try {
                const res = await isConnected()
                // v3 returns { isConnected: boolean }
                const connected = typeof res === 'object' ? res.isConnected : !!res
                
                const resAllowed = await isAllowed()
                const allowed = typeof resAllowed === 'object' ? resAllowed.isAllowed : !!resAllowed
                
                setIsAlive(connected && allowed)
            } catch (e) {
                setIsAlive(false)
            }
        }

        checkConnection()
        const timer = setInterval(checkConnection, 30000)
        return () => clearInterval(timer)
    }, [publicKey])

    const ensureWalletConnected = useCallback(async () => {
        const res = await isConnected()
        const connected = typeof res === 'object' ? res.isConnected : !!res
        if (!connected) {
            throw new Error("Freighter wallet not found. Please install it.")
        }

        const resAllowed = await isAllowed()
        const allowed = typeof resAllowed === 'object' ? resAllowed.isAllowed : !!resAllowed
        if (!allowed) {
            const resAccess = await requestAccess()
            if (resAccess?.error) throw new Error(resAccess.error)
        }

        const resAddr = await getAddress()
        const address = typeof resAddr === 'object' ? resAddr.address : resAddr
        if (!address) throw new Error("Could not get wallet address")

        setPublicKey(address)
        setConnectedWalletId('freighter')
        setIsAlive(true)
        return address
    }, [])

    const connectFreighter = useCallback(async () => {
        setIsConnecting(true)
        setWalletError(null)

        try {
            const resAccess = await requestAccess()
            if (resAccess?.error) throw new Error(resAccess.error)
            
            const resAddr = await getAddress()
            const address = typeof resAddr === 'object' ? resAddr.address : resAddr
            if (!address) throw new Error("Could not get wallet address")

            setPublicKey(address)
            setConnectedWalletId('freighter')
            setIsConnecting(false)
        } catch (err) {
            console.error('Wallet connection failed:', err)
            const parsed = parseWalletError(err)
            const rawMsg = (err?.message || err?.toString?.() || '').toLowerCase()
            const message = parsed.code === 'WALLET_CONNECTION_FAILED' && rawMsg
                ? `${parsed.message} (${err?.message || err})`
                : parsed.message
            setWalletError(message)
            if (setGlobalError) setGlobalError({ ...parsed, message })
            setIsConnecting(false)
        }
    }, [setGlobalError])

    const connectXbullExtension = useCallback(async () => {
        setIsConnecting(true)
        setWalletError(null)

        try {
            const { address, walletId } = await connectXbull('extension')
            setPublicKey(address)
            setConnectedWalletId(walletId)
            setIsConnecting(false)
        } catch (err) {
            console.error('Wallet connection failed:', err)
            const parsed = parseWalletError(err)
            const rawMsg = (err?.message || err?.toString?.() || '').toLowerCase()
            const message = parsed.code === 'WALLET_CONNECTION_FAILED' && rawMsg
                ? `${parsed.message} (${err?.message || err})`
                : parsed.message
            setWalletError(message)
            if (setGlobalError) setGlobalError({ ...parsed, message })
            setIsConnecting(false)
        }
    }, [setGlobalError])

    const connectXbullWeb = useCallback(async () => {
        setIsConnecting(true)
        setWalletError(null)

        try {
            const { address, walletId } = await connectXbull('web')
            setPublicKey(address)
            setConnectedWalletId(walletId)
            setIsConnecting(false)
        } catch (err) {
            console.error('Wallet connection failed:', err)
            const parsed = parseWalletError(err)
            const rawMsg = (err?.message || err?.toString?.() || '').toLowerCase()
            const message = parsed.code === 'WALLET_CONNECTION_FAILED' && rawMsg
                ? `${parsed.message} (${err?.message || err})`
                : parsed.message
            setWalletError(message)
            if (setGlobalError) setGlobalError({ ...parsed, message })
            setIsConnecting(false)
        }
    }, [setGlobalError])

    const disconnectWallet = useCallback(() => {
        setPublicKey(null)
        setWalletError(null)
        setConnectedWalletId(null)
    }, [])

    const signTx = useCallback(async (xdr) => {
        if (!publicKey) throw new Error("Wallet not connected")
        try {
            if (connectedWalletId === 'xbull-extension' || connectedWalletId === 'xbull-web') {
                return await signWithXbull(connectedWalletId, xdr, publicKey)
            }

            return await signWithFreighter(xdr)
        } catch (err) {
            const parsed = parseWalletError(err)
            if (setGlobalError) setGlobalError(parsed)
            throw new Error(parsed.message)
        }
    }, [publicKey, connectedWalletId, setGlobalError])

    const openWalletModal = connectFreighter

    return {
        publicKey,
        isConnecting,
        walletError,
        connectedWalletId,
        openWalletModal,
        connectFreighter,
        connectXbullExtension,
        connectXbullWeb,
        disconnectWallet,
        signTx,
        ensureWalletConnected,
        isAlive
    }
}
