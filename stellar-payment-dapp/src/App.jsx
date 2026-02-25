import React, { useRef } from 'react'
import Header from './components/Header'
import WalletCard from './components/WalletCard'
import SendForm from './components/SendForm'
import { useWallet } from './hooks/useWallet'
import { useBalance } from './hooks/useBalance'

export default function App() {
    const { publicKey, isConnecting, walletError, connectWallet, disconnectWallet } =
        useWallet()

    // Top-level balance so SendForm can trigger a refresh after successful tx
    const { refreshBalance } = useBalance(publicKey)

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
            <Header rightSlot={disconnectSlot} />

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
                        onConnect={connectWallet}
                        refreshBalance={refreshBalance}
                    />

                    <SendForm publicKey={publicKey} refreshBalance={refreshBalance} />
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
        </div>
    )
}
