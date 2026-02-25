import React, { useState } from 'react'
import { sendXLM, isValidStellarAddress } from '../utils/stellar'
import StatusBanner from './StatusBanner'

/**
 * Helper to extract a user-friendly message from Horizon/Freighter errors.
 */
function parseError(err) {
    const msg = err?.message || ''

    if (
        msg.toLowerCase().includes('reject') ||
        msg.toLowerCase().includes('declined') ||
        msg.toLowerCase().includes('user declined')
    ) {
        return 'You rejected the transaction in Freighter.'
    }
    if (msg.toLowerCase().includes('insufficient')) {
        return 'Insufficient XLM balance.'
    }

    // Horizon extras
    const extras = err?.response?.data?.extras
    if (extras) {
        const rc = extras?.result_codes
        if (rc?.operations?.includes('op_underfunded')) {
            return 'Insufficient XLM balance.'
        }
        if (rc?.operations?.includes('op_no_destination')) {
            return 'Invalid destination address.'
        }
    }

    if (msg.toLowerCase().includes('invalid destination') || msg.toLowerCase().includes('op_no_destination')) {
        return 'Invalid destination address.'
    }
    if (
        msg.toLowerCase().includes('network') ||
        msg.toLowerCase().includes('failed to fetch') ||
        msg.toLowerCase().includes('timeout')
    ) {
        return 'Network error. Please try again.'
    }

    return msg || 'An unknown error occurred.'
}

/**
 * SendForm – the XLM payment form.
 *
 * Props:
 *   publicKey       – string | null  (sender's public key)
 *   refreshBalance  – () => void     (called on successful tx to update balance)
 */
export default function SendForm({ publicKey, refreshBalance }) {
    const [recipient, setRecipient] = useState('')
    const [amount, setAmount] = useState('')
    const [memo, setMemo] = useState('')

    const [recipientTouched, setRecipientTouched] = useState(false)
    const [amountTouched, setAmountTouched] = useState(false)

    const [isLoading, setIsLoading] = useState(false)
    const [txStatus, setTxStatus] = useState(null)

    // ── Validation ──────────────────────────────────────────────────────────────
    const recipientError = (() => {
        if (!recipient.trim()) return 'Recipient address is required'
        if (!isValidStellarAddress(recipient.trim())) return 'Invalid Stellar address'
        return null
    })()

    const amountError = (() => {
        if (!amount) return 'Amount is required'
        const n = parseFloat(amount)
        if (isNaN(n) || n <= 0) return 'Must be a positive number'
        if (n < 0.0000001) return 'Minimum amount is 0.0000001 XLM'
        return null
    })()

    const isFormValid = !recipientError && !amountError && !!publicKey

    // ── Submit ──────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!isFormValid || isLoading) return

        setRecipientTouched(true)
        setAmountTouched(true)
        if (!isFormValid) return

        setIsLoading(true)
        setTxStatus(null)

        try {
            const result = await sendXLM(
                publicKey,
                recipient.trim(),
                amount,
                memo.trim()
            )

            setTxStatus({ type: 'success', hash: result.hash })
            setRecipient('')
            setAmount('')
            setMemo('')
            setRecipientTouched(false)
            setAmountTouched(false)

            if (refreshBalance) refreshBalance()
        } catch (err) {
            setTxStatus({ type: 'error', message: parseError(err) })
        } finally {
            setIsLoading(false)
        }
    }

    // ── Render ──────────────────────────────────────────────────────────────────
    return (
        <div className="card" style={{ marginTop: '16px' }}>
            <h2
                style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#e8e8f0',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}
            >
                <span>💸</span> Send XLM
            </h2>

            <form onSubmit={handleSubmit} noValidate>
                {/* ── Recipient ── */}
                <div style={{ marginBottom: '16px' }}>
                    <label htmlFor="recipient-input">Recipient Address</label>
                    <input
                        id="recipient-input"
                        type="text"
                        className={`input-field${recipientTouched && recipientError ? ' error' : ''}`}
                        placeholder="G..."
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        onBlur={() => setRecipientTouched(true)}
                        disabled={isLoading || !publicKey}
                        autoComplete="off"
                        spellCheck={false}
                    />
                    {recipientTouched && recipientError && (
                        <p
                            style={{
                                color: '#ff5252',
                                fontSize: '0.78rem',
                                marginTop: '4px',
                            }}
                        >
                            {recipientError}
                        </p>
                    )}
                </div>

                {/* ── Amount ── */}
                <div style={{ marginBottom: '16px' }}>
                    <label htmlFor="amount-input">Amount (XLM)</label>
                    <input
                        id="amount-input"
                        type="number"
                        className={`input-field${amountTouched && amountError ? ' error' : ''}`}
                        placeholder="0.00"
                        min="0.0000001"
                        step="any"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        onBlur={() => setAmountTouched(true)}
                        disabled={isLoading || !publicKey}
                    />
                    {amountTouched && amountError && (
                        <p
                            style={{
                                color: '#ff5252',
                                fontSize: '0.78rem',
                                marginTop: '4px',
                            }}
                        >
                            {amountError}
                        </p>
                    )}
                </div>

                {/* ── Memo ── */}
                <div style={{ marginBottom: '24px' }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '6px',
                        }}
                    >
                        <label htmlFor="memo-input" style={{ margin: 0 }}>
                            Memo{' '}
                            <span style={{ color: '#555577', fontWeight: 400 }}>(optional)</span>
                        </label>
                        <span
                            style={{
                                fontSize: '0.75rem',
                                color: memo.length > 24 ? '#ffd740' : '#8888aa',
                                fontVariantNumeric: 'tabular-nums',
                            }}
                        >
                            {memo.length}/28
                        </span>
                    </div>
                    <input
                        id="memo-input"
                        type="text"
                        className="input-field"
                        placeholder="Optional memo (max 28 chars)"
                        maxLength={28}
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        disabled={isLoading || !publicKey}
                    />
                </div>

                {/* ── Submit button ── */}
                <button
                    id="send-xlm-btn"
                    type="submit"
                    className="btn btn-primary btn-full"
                    disabled={!isFormValid || isLoading}
                    style={{ fontSize: '1rem' }}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner" />
                            Sending…
                        </>
                    ) : (
                        '🚀 Send XLM'
                    )}
                </button>

                {!publicKey && (
                    <p
                        style={{
                            textAlign: 'center',
                            color: '#8888aa',
                            fontSize: '0.8125rem',
                            marginTop: '10px',
                        }}
                    >
                        Connect your wallet above to send XLM
                    </p>
                )}
            </form>

            {/* ── Status Banner ── */}
            {txStatus && (
                <div style={{ marginTop: '16px' }}>
                    <StatusBanner txStatus={txStatus} />
                </div>
            )}
        </div>
    )
}
