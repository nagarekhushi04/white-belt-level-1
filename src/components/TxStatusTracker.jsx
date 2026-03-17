import React, { useEffect, useState } from 'react';

/**
 * TxStatusTracker
 * 
 * Props:
 *   status - 'idle' | 'pending' | 'success' | 'failed'
 *   hash   - string | null
 *   error  - string | null
 */
export default function TxStatusTracker({ status, hash, error }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (status !== 'idle') {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [status]);

    if (!visible) return null;

    // Config for states
    const states = {
        pending: {
            icon: (
                <div style={{ width: '24px', height: '24px', position: 'relative' }}>
                    <div className="spinner" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderTopColor: '#00d4ff' }}></div>
                </div>
            ),
            title: '⏳ Transaction Pending...',
            subtitle: 'Waiting for network confirmation',
            theme: '#00d4ff',
            bg: 'rgba(0,212,255,0.05)',
            border: 'rgba(0,212,255,0.2)'
        },
        success: {
            icon: <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>✅</span>,
            title: 'Transaction Confirmed!',
            subtitle: 'Confirmed on Stellar Testnet',
            theme: '#00e676',
            bg: 'rgba(0,230,118,0.05)',
            border: 'rgba(0,230,118,0.2)'
        },
        failed: {
            icon: <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>❌</span>,
            title: 'Transaction Failed',
            subtitle: error || 'Something went wrong.',
            theme: '#ff5252',
            bg: 'rgba(255,82,82,0.05)',
            border: 'rgba(255,82,82,0.2)'
        }
    };

    const current = states[status];
    if (!current) return null;

    return (
        <div style={{
            marginTop: '16px',
            padding: '16px',
            background: current.bg,
            border: `1px solid ${current.border}`,
            borderRadius: '12px',
            animation: 'slideInFade 0.4s ease-out forwards',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
            <style>
                {`
                @keyframes slideInFade {
                    0% { opacity: 0; transform: translateY(-10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                `}
            </style>

            <div style={{ paddingTop: '2px' }}>
                {current.icon}
            </div>

            <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 600, color: current.theme }}>
                    {current.title}
                </h4>

                <p style={{ margin: 0, fontSize: '0.85rem', color: '#8888aa', lineHeight: 1.4 }}>
                    {current.subtitle}
                </p>

                {status === 'success' && hash && (
                    <div style={{ marginTop: '8px', fontSize: '0.75rem' }}>
                        <div
                            style={{
                                fontFamily: 'monospace',
                                color: '#8888aa',
                                marginBottom: '6px',
                                wordBreak: 'break-all',
                            }}
                        >
                            Tx: {hash.slice(0, 8)}…{hash.slice(-8)}
                        </div>
                        <a
                            href={`https://stellar.expert/explorer/testnet/tx/${hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: current.theme,
                                textDecoration: 'underline',
                                fontFamily: 'monospace',
                                opacity: 0.9,
                            }}
                        >
                            View on Stellar Expert ↗
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
