import React from 'react'

/**
 * Header – top navigation bar for Stellar Pay
 *
 * Props:
 *   rightSlot – React node to render on the right side (wallet address + disconnect button)
 */
export default function Header({ rightSlot }) {
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
                </div>

                {/* ─── Right: Wallet slot ─── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {rightSlot}
                </div>
            </div>
        </header>
    )
}
