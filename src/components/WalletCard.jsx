import React, { useState } from 'react'
import { useBalance } from '../hooks/useBalance'
import { fundWithFriendbot, isValidStellarAddress } from '../utils/stellar'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function truncateKey(key) {
    if (!key) return ''
    return `${key.slice(0, 4)}...${key.slice(-4)}`
}

// ─── Balance section ─────────────────────────────────────────────────────────

function BalanceDisplay({ publicKey, refreshBalance: externalRefresh }) {
    const { balance, isLoadingBalance, balanceError, refreshBalance } =
        useBalance(publicKey)

    const [isFunding, setIsFunding] = useState(false)
    const [fundToast, setFundToast] = useState(null)

    const handleFriendbot = async () => {
        setIsFunding(true)
        setFundToast(null)
        try {
            await fundWithFriendbot(publicKey)
            await refreshBalance()
            if (externalRefresh) externalRefresh()
            setFundToast({ type: 'success', message: 'Account funded! Balance refreshed.' })
        } catch (err) {
            setFundToast({ type: 'error', message: err?.message || 'Friendbot failed.' })
        } finally {
            setIsFunding(false)
            setTimeout(() => setFundToast(null), 5000)
        }
    }

    return (
        <div style={{ marginTop: '20px' }}>
            <div
                style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#8888aa',
                    marginBottom: '6px',
                }}
            >
                Balance
            </div>

            {isLoadingBalance ? (
                <div
                    className="skeleton"
                    style={{ height: '32px', width: '160px', borderRadius: '8px' }}
                />
            ) : balanceError === 'Account not funded' ? (
                <p style={{ color: '#ff5252', fontWeight: 500, marginBottom: '4px' }}>
                    Account not funded – use Friendbot below
                </p>
            ) : balanceError ? (
                <p style={{ color: '#ff5252', fontSize: '0.875rem' }}>{balanceError}</p>
            ) : (
                <p
                    style={{
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        color: '#e8e8f0',
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                    }}
                >
                    {balance ? parseFloat(balance).toFixed(7) : '0.0000000'}
                    <span
                        style={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            color: '#8888aa',
                            marginLeft: '6px',
                        }}
                    >
                        XLM
                    </span>
                </p>
            )}

            <button
                id="friendbot-btn"
                className="btn btn-ghost"
                onClick={handleFriendbot}
                disabled={isFunding}
                style={{ marginTop: '14px', fontSize: '0.875rem', padding: '9px 16px' }}
            >
                {isFunding ? (
                    <>
                        <span className="spinner" />
                        Funding…
                    </>
                ) : (
                    '💧 Fund with Friendbot'
                )}
            </button>

            {fundToast && (
                <div
                    className={fundToast.type === 'success' ? 'toast-success' : 'toast-error'}
                    style={{ marginTop: '10px', fontSize: '0.8125rem' }}
                >
                    {fundToast.message}
                </div>
            )}
        </div>
    )
}

// ─── Demo Connect Panel ───────────────────────────────────────────────────────

function DemoConnectPanel({ onConnectDemo }) {
    const [inputKey, setInputKey] = useState('')
    const [inputError, setInputError] = useState(null)

    const handleConnect = () => {
        const trimmed = inputKey.trim()
        if (!trimmed) {
            setInputError('Please enter a Stellar public key.')
            return
        }
        if (!isValidStellarAddress(trimmed)) {
            setInputError('Invalid Stellar public key. Must start with G and be 56 characters.')
            return
        }
        setInputError(null)
        onConnectDemo(trimmed)
    }

    return (
        <div
            style={{
                marginTop: '20px',
                padding: '16px',
                background: 'rgba(255,215,64,0.05)',
                border: '1px solid rgba(255,215,64,0.2)',
                borderRadius: '12px',
            }}
        >
            <p
                style={{
                    fontSize: '0.8125rem',
                    color: '#ffd740',
                    fontWeight: 600,
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                }}
            >
                🔑 Demo Mode – Enter Stellar Address
            </p>
            <p style={{ fontSize: '0.75rem', color: '#8888aa', marginBottom: '12px' }}>
                Freighter extension not found. You can still view balances by entering a Stellar public key below.
            </p>
            <input
                id="demo-key-input"
                type="text"
                className={`input-field${inputError ? ' error' : ''}`}
                placeholder="GABC... (your Stellar public key)"
                value={inputKey}
                onChange={(e) => {
                    setInputKey(e.target.value)
                    setInputError(null)
                }}
                spellCheck={false}
                autoComplete="off"
                style={{ marginBottom: inputError ? '4px' : '12px' }}
            />
            {inputError && (
                <p style={{ color: '#ff5252', fontSize: '0.75rem', marginBottom: '10px' }}>
                    {inputError}
                </p>
            )}
            <button
                id="demo-connect-btn"
                className="btn btn-primary btn-full"
                onClick={handleConnect}
                style={{ fontSize: '0.875rem' }}
            >
                👁 View Wallet (Read-Only)
            </button>
            <p style={{ fontSize: '0.72rem', color: '#555577', marginTop: '8px', textAlign: 'center' }}>
                Install{' '}
                <a
                    href="https://www.freighter.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#00d4ff', textDecoration: 'underline' }}
                >
                    Freighter
                </a>{' '}
                for full send functionality
            </p>
        </div>
    )
}

// ─── Main WalletCard ──────────────────────────────────────────────────────────

/**
 * WalletCard
 *
 * Props:
 *   publicKey         – string | null
 *   isConnecting      – boolean
 *   walletError       – string | null
 *   freighterMissing  – boolean
 *   onConnect         – () => void
 *   onConnectDemo     – (key: string) => void
 *   refreshBalance    – optional external refresh callback
 */
export default function WalletCard({
    publicKey,
    isConnecting,
    walletError,
    freighterMissing,
    onConnect,
    onConnectDemo,
    refreshBalance,
}) {
    // ── NOT CONNECTED ──
    if (!publicKey) {
        return (
            <div className="card">
                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                    <div
                        style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background:
                                'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,153,204,0.05))',
                            border: '1px solid rgba(0,212,255,0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.8rem',
                            margin: '0 auto 16px',
                        }}
                    >
                        ⭐
                    </div>

                    <h2
                        style={{
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            marginBottom: '6px',
                            color: '#e8e8f0',
                        }}
                    >
                        Connect Your Wallet
                    </h2>
                    <p
                        style={{
                            fontSize: '0.875rem',
                            color: '#8888aa',
                            marginBottom: '20px',
                        }}
                    >
                        Use Freighter to send XLM on Testnet
                    </p>

                    <button
                        id="connect-wallet-btn"
                        className="btn btn-primary btn-full"
                        onClick={onConnect}
                        disabled={isConnecting}
                    >
                        {isConnecting ? (
                            <>
                                <span className="spinner" />
                                Connecting…
                            </>
                        ) : (
                            '🔗 Connect Freighter'
                        )}
                    </button>

                    {/* Show demo panel when Freighter is missing */}
                    {freighterMissing && onConnectDemo && (
                        <DemoConnectPanel onConnectDemo={onConnectDemo} />
                    )}

                    {/* Show non-Freighter errors (not the "missing" error) */}
                    {walletError && !freighterMissing && (
                        <div className="toast-error" style={{ marginTop: '14px', textAlign: 'left' }}>
                            <p style={{ fontSize: '0.8125rem' }}>{walletError}</p>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // ── CONNECTED ──
    return (
        <div className="card">
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '4px',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                        style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#00e676',
                            display: 'inline-block',
                            boxShadow: '0 0 6px rgba(0,230,118,0.7)',
                        }}
                    />
                    <span style={{ fontSize: '0.8rem', color: '#8888aa', fontWeight: 500 }}>
                        Connected
                    </span>
                </div>
            </div>

            {/* Public key */}
            <div
                style={{
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    color: '#00d4ff',
                    background: 'rgba(0,212,255,0.07)',
                    border: '1px solid rgba(0,212,255,0.2)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    marginTop: '8px',
                    wordBreak: 'break-all',
                    letterSpacing: '0.02em',
                }}
            >
                {truncateKey(publicKey)}
            </div>

            {/* Balance + Friendbot */}
            <BalanceDisplay publicKey={publicKey} refreshBalance={refreshBalance} />
        </div>
    )
}
