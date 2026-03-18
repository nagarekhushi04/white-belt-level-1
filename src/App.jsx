import React, { useState, useCallback } from 'react'
import Header from './components/Header'
import WalletCard from './components/WalletCard'
import SendForm from './components/SendForm'
import ContractCard from './components/ContractCard'
import EventFeed from './components/EventFeed'
import TxStatusTracker from './components/TxStatusTracker'
import ErrorToast from './components/ErrorToast'
import { useWallet } from './hooks/useWallet'
import { useBalance } from './hooks/useBalance'
import { useTxStatus } from './hooks/useTxStatus'
import { useContractEvents } from './hooks/useContractEvents'
import SwapDashboard from './components/level-4/SwapDashboard'

export default function App() {
    const [globalError, setGlobalError] = useState(null)

    const {
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
    } =
        useWallet(setGlobalError)

    // Global transaction status for Send XLM and Contract Calls
    const txTracker = useTxStatus()

    // Top-level balance so SendForm can trigger a refresh after successful tx
    const { balance, refreshBalance } = useBalance(publicKey)

    // Contract events state
    const [events, setEvents] = useState([])

    // Callback when a new contract event arrives
    const handleNewEvent = useCallback((newEvent) => {
        setEvents((prev) => {
            // Unshift to put newest at the top, max 10 events
            const updated = [newEvent, ...prev]
            return updated.slice(0, 10)
        })
        // Contract transactions cost XLM fees, so refresh balance automatically
        refreshBalance()
    }, [refreshBalance])

    // Mount event listener
    useContractEvents(handleNewEvent)

    // ── Disconnect button rendered into the header slot ──
    const disconnectSlot = publicKey ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
                style={{
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    color: '#00d4ff',
                    background: 'rgba(0,212,255,0.08)',
                    border: '1px solid rgba(0,212,255,0.2)',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    display: 'none', // hidden on mobile, shown on sm+
                }}
                className="hidden sm:inline"
            >
                {publicKey.slice(0, 4)}…{publicKey.slice(-4)}
            </span>
            <button
                id="disconnect-wallet-btn"
                className="btn btn-danger"
                onClick={disconnectWallet}
                style={{ padding: '7px 14px', fontSize: '0.8125rem' }}
            >
                Disconnect
            </button>
        </div>
    ) : null

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--color-bg)',
            }}
        >
            {/* ── Header ── */}
            <Header
                rightSlot={disconnectSlot}
                isAlive={isAlive}
                publicKey={publicKey}
                balance={balance}
            />

            {/* Global Low Balance Warning */ }
            {publicKey && balance !== null && parseFloat(balance) < 5 && (
                 <div style={{
                    background: 'rgba(255, 183, 77, 0.1)',
                    borderBottom: '1px solid rgba(255, 183, 77, 0.3)',
                    color: '#ffb74d',
                    padding: '8px 16px',
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    zIndex: 40,
                    position: 'relative',
                 }}>
                     ⚠️ Your testnet balance is very low ({parseFloat(balance).toFixed(2)} XLM). Transactions may fail due to gas fees.
                 </div>
            )}

            {/* ── Background decorative blobs ── */}
            <div
                aria-hidden
                style={{
                    position: 'fixed',
                    top: '-20%',
                    left: '-10%',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background:
                        'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />
            <div
                aria-hidden
                style={{
                    position: 'fixed',
                    bottom: '-15%',
                    right: '-10%',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background:
                        'radial-gradient(circle, rgba(100,0,255,0.05) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />

            {/* ── Main content ── */}
            <main
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '32px 16px 80px',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* Tagline */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <h1
                        style={{
                            fontSize: 'clamp(1.4rem, 4vw, 2rem)',
                            fontWeight: 700,
                            color: '#e8e8f0',
                            letterSpacing: '-0.02em',
                            marginBottom: '8px',
                        }}
                    >
                        Send XLM on{' '}
                        <span
                            style={{
                                background: 'linear-gradient(120deg, #00d4ff, #9b59f4)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Stellar Testnet
                        </span>
                    </h1>
                    <p style={{ color: '#8888aa', fontSize: '0.9rem' }}>
                        Simple, fast, fee-light payments powered by Freighter
                    </p>
                </div>

                {/* Cards container */}
                <div
                    style={{
                        width: '100%',
                        maxWidth: '480px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0',
                    }}
                >
                    <WalletCard
                        publicKey={publicKey}
                        isConnecting={isConnecting}
                        walletError={walletError}
                        connectedWalletId={connectedWalletId}
                        onConnect={openWalletModal}
                        onConnectFreighter={connectFreighter}
                        onConnectXbullExtension={connectXbullExtension}
                        onConnectXbullWeb={connectXbullWeb}
                        refreshBalance={refreshBalance}
                    />

                    <SendForm
                        publicKey={publicKey}
                        signTx={signTx}
                        refreshBalance={refreshBalance}
                        setTxLoading={txTracker.setLoading}
                        setTxSuccess={txTracker.setSuccess}
                        setTxFailed={txTracker.setFailed}
                    />

                    <ContractCard
                        publicKey={publicKey}
                        signTx={signTx}
                        txTracker={{
                            setLoading: txTracker.setLoading,
                            setSuccess: txTracker.setSuccess,
                            setFailed: txTracker.setFailed
                        }}
                        ensureWalletConnected={ensureWalletConnected}
                        isAlive={isAlive}
                    />

                    {/* Global Transaction Status Banner */}
                    <TxStatusTracker
                        status={txTracker.status}
                        hash={txTracker.hash}
                        error={txTracker.error}
                    />

                    <EventFeed events={events} />

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent my-8"></div>
                        
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-white tracking-tight">Level 4 Features</h2>
                        <p className="text-slate-500 text-sm">Automated Market Maker & Factory Contracts</p>
                    </div>

                    <SwapDashboard 
                        walletAddress={publicKey} 
                        isConnected={!!publicKey} 
                    />
                </div>
            </main>

            {/* ── Footer ── */}
            <footer
                style={{
                    textAlign: 'center',
                    padding: '16px',
                    color: '#555577',
                    fontSize: '0.78rem',
                    borderTop: '1px solid #1e1e35',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                Built on Stellar Testnet · Not for real funds
            </footer>

            <ErrorToast globalError={globalError} setGlobalError={setGlobalError} />
        </div>
    )
}
