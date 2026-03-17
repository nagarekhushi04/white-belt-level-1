import React, { useEffect, useState } from 'react';

/**
 * ErrorToast
 * A global sliding toast notification for app-wide errors/warnings.
 */
export default function ErrorToast({ globalError, setGlobalError }) {
    const [renderError, setRenderError] = useState(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (globalError) {
            setRenderError(globalError)
            setVisible(true)

            // Auto dismiss after 4 seconds
            const timer = setTimeout(() => {
                setVisible(false)
                setTimeout(() => setGlobalError(null), 300) // Clear state after slide up animation finishes
            }, 4000)

            return () => clearTimeout(timer)
        }
    }, [globalError, setGlobalError])

    if (!renderError) return null

    const isWarning = renderError.code === "USER_REJECTED" || renderError.message?.toLowerCase().includes("rejected")
    const bgColor = isWarning ? 'rgba(255, 215, 64, 0.95)' : 'rgba(255, 82, 82, 0.95)'
    const borderColor = isWarning ? 'rgba(255, 215, 64, 1)' : 'rgba(255, 82, 82, 1)'

    return (
        <div style={{
            position: 'fixed',
            top: visible ? '20px' : '-80px',
            right: '20px',
            zIndex: 9999,
            background: bgColor,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${borderColor}`,
            borderRadius: '8px',
            padding: '12px 16px',
            minWidth: '280px',
            maxWidth: '380px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            transition: 'top 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            cursor: 'pointer'
        }}
            onClick={() => setVisible(false)}
        >
            <div style={{ fontSize: '1.2rem', marginTop: '-2px' }}>
                {isWarning ? '⚠️' : '🚨'}
            </div>
            <div style={{ flex: 1 }}>
                {renderError.code && (
                    <div style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        background: 'rgba(0,0,0,0.15)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        display: 'inline-block',
                        marginBottom: '4px',
                        color: '#fff'
                    }}>
                        {renderError.code}
                    </div>
                )}
                <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.4 }}>
                    {renderError.message || renderError}
                </div>
            </div>
        </div>
    )
}
