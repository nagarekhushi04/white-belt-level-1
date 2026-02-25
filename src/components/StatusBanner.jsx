import React from 'react'

/**
 * StatusBanner – displays transaction success or error state.
 *
 * Props:
 *   txStatus – { type: 'success' | 'error', message?: string, hash?: string } | null
 */
export default function StatusBanner({ txStatus }) {
    if (!txStatus) return null

    if (txStatus.type === 'success') {
        return (
            <div className="toast-success animate-fade-in" role="alert">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: '1px' }}>✅</span>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, marginBottom: '4px', color: '#00e676' }}>
                            Transaction Successful!
                        </p>
                        {txStatus.hash && (
                            <p style={{ fontSize: '0.8125rem', wordBreak: 'break-all' }}>
                                Hash:{' '}
                                <a
                                    href={`https://stellar.expert/explorer/testnet/tx/${txStatus.hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        color: '#00d4ff',
                                        textDecoration: 'underline',
                                        wordBreak: 'break-all',
                                    }}
                                >
                                    {txStatus.hash.slice(0, 16)}…{txStatus.hash.slice(-8)}
                                </a>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="toast-error animate-fade-in" role="alert">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: '1px' }}>❌</span>
                <div>
                    <p style={{ fontWeight: 600, marginBottom: '4px', color: '#ff5252' }}>
                        Transaction Failed
                    </p>
                    {txStatus.message && (
                        <p style={{ fontSize: '0.8125rem' }}>{txStatus.message}</p>
                    )}
                </div>
            </div>
        </div>
    )
}
