import { describe, expect, it } from 'vitest'
import { parseContractError, parseWalletError } from '../utils/errorHandler.js'

describe('errorHandler', () => {
    it('parseWalletError maps user rejection to friendly message', () => {
        expect(parseWalletError(new Error('USER_REJECTED'))).toEqual({
            code: 'USER_REJECTED',
            message: 'You rejected the transaction in your wallet.',
        })
    })

    it('parseContractError maps network failures to user-friendly message', () => {
        const msg = parseContractError(new Error('Failed to fetch'))
        expect(msg).toMatch(/network connection issue/i)
    })
})

