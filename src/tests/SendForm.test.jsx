import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SendForm from '../components/SendForm.jsx'

describe('SendForm', () => {
    it('renders and prompts to connect wallet when publicKey missing', () => {
        render(
            <SendForm
                publicKey={null}
                signTx={vi.fn()}
                refreshBalance={vi.fn()}
                setTxLoading={vi.fn()}
                setTxSuccess={vi.fn()}
                setTxFailed={vi.fn()}
            />
        )

        expect(screen.getByText('Send XLM')).toBeInTheDocument()
        expect(screen.getByText('Connect your wallet above to send XLM')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /send xlm/i })).toBeDisabled()
    })

    it('shows validation error for invalid recipient after blur', () => {
        render(
            <SendForm
                publicKey={'GD6W4QX7YJ7BPGY4F2JH2V7XQ4L7G4W7W6V7W6V7W6V7W6V7W6V7W6V7'}
                signTx={vi.fn()}
                refreshBalance={vi.fn()}
                setTxLoading={vi.fn()}
                setTxSuccess={vi.fn()}
                setTxFailed={vi.fn()}
            />
        )

        const recipientInput = screen.getByLabelText('Recipient Address')
        fireEvent.change(recipientInput, { target: { value: 'NOT_A_STELLAR_ADDRESS' } })
        fireEvent.blur(recipientInput)

        expect(screen.getByText('Invalid Stellar address')).toBeInTheDocument()
    })
})

