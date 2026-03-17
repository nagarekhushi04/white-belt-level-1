import React from 'react'

/**
 * Header – top navigation bar for Stellar Pay
 *
 * Props:
 *   rightSlot – React node to render on the right side (wallet address + disconnect button)
 */
export default function Header({ rightSlot, isAlive, publicKey, balance }) {
    return (
        <header
            style={{
                background: 'rgba(15, 15, 26, 0.85)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid #2a2a4a',
                position: 'sticky',
                top: 0,
                zIndex: 50,
            }}
        >
            <div
                style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    padding: '0 16px',
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                {/* ─── Left: Brand ─── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>⭐</span>
                    <span
                        style={{
                            fontSize: '1.125rem',
                            fontWeight: 700,
                            color: '#e8e8f0',
                            letterSpacing: '-0.01em',
                        }}
                    >
                        Stellar Pay
                    </span>

                    {/* Testnet badge */}
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: 'rgba(255, 215, 64, 0.12)',
                            border: '1px solid rgba(255, 215, 64, 0.30)',
                            borderRadius: '20px',
                            padding: '2px 10px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            color: '#ffd740',
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                        }}
                    >
                        <span style={{ fontSize: '0.65rem' }}>🟡</span>
                        Testnet
                    </span>

                    {/* Wallet Status Indicator */}
                    {!publicKey ? (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginLeft: '12px',
                            padding: '3px 10px',
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            color: '#8888aa'
                        }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8888aa' }} />
                            WAITING FOR WALLET
                        </div>
                    ) : (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginLeft: '12px',
                            padding: '3px 10px',
                            borderRadius: '20px',
                            background: isAlive ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 82, 82, 0.1)',
                            border: `1px solid ${isAlive ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255, 82, 82, 0.2)'}`,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            color: isAlive ? '#00e676' : '#ff5252'
                        }}>
                            <span style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: isAlive ? '#00e676' : '#ff5252',
                                boxShadow: isAlive ? '0 0 8px #00e676' : '0 0 8px #ff5252'
                            }} />
                            {isAlive ? 'ACTIVE' : 'DISCONNECTED'}
                        </div>
                    )}

                    {/* Live Balance Indicator */}
                    {publicKey && balance !== null && (
                         <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginLeft: '8px',
                            padding: '3px 8px',
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: parseFloat(balance) < 5 ? '#ffb74d' : '#e8e8f0', // Warning color if low
                        }}>
                             {parseFloat(balance).toFixed(2)} XLM
                         </div>
                    )}
                </div>

                {/* ─── Right: Wallet slot ─── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {rightSlot}
                </div>
            </div>
        </header>
    )
}
