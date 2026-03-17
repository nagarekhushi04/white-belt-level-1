import React, { useState } from 'react'
import { useBalance } from '../hooks/useBalance'
import { fundWithFriendbot } from '../utils/stellar'

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

// ─── Main WalletCard ──────────────────────────────────────────────────────────

/**
 * WalletCard
 *
 * Props:
 *   publicKey         – string | null
 *   isConnecting      – boolean
 *   walletError       – string | null
 *   connectedWalletId – string | null
 *   onConnect         – () => void
 *   refreshBalance    – optional external refresh callback
 */
export default function WalletCard({
    publicKey,
    isConnecting,
    walletError,
    connectedWalletId,
    onConnect,
    onConnectFreighter,
    onConnectXbullExtension,
    onConnectXbullWeb,
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
                        Use a Stellar wallet to interact with Testnet
                    </p>

                    <button
                        id="connect-wallet-btn"
                        className="btn btn-primary btn-full"
                        onClick={onConnectFreighter || onConnect}
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

                    <button
                        id="connect-xbull-extension-btn"
                        className="btn btn-ghost btn-full"
                        onClick={onConnectXbullExtension || onConnect}
                        disabled={isConnecting}
                        style={{ marginTop: '10px' }}
                    >
                        Connect xBull (Extension)
                    </button>

                    <button
                        id="connect-xbull-web-btn"
                        className="btn btn-ghost btn-full"
                        onClick={onConnectXbullWeb || onConnect}
                        disabled={isConnecting}
                        style={{ marginTop: '10px' }}
                    >
                        Connect xBull (Web)
                    </button>

                    {walletError && (
                        <div className="toast-error" style={{ marginTop: '14px', textAlign: 'left', background: 'rgba(255, 82, 82, 0.1)', border: '1px solid rgba(255, 82, 82, 0.3)' }}>
                            <p style={{ fontSize: '0.8125rem', margin: 0 }}>{walletError}</p>
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
                    {connectedWalletId && (
                        <span style={{
                            fontSize: '0.7rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(0,212,255,0.1)',
                            border: '1px solid rgba(0,212,255,0.2)',
                            color: '#00d4ff',
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            letterSpacing: '0.05em'
                        }}>
                            {connectedWalletId}
                        </span>
                    )}
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
