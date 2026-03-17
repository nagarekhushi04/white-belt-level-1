import { describe, expect, it, vi } from 'vitest'
import * as stellar from '../utils/stellar.js'

describe('stellar utils', () => {
    it('isValidStellarAddress returns false for invalid string', () => {
        expect(stellar.isValidStellarAddress('NOT_A_KEY')).toBe(false)
    })

    it('checkSufficientBalance throws a clear error when balance is too low', async () => {
        vi.spyOn(stellar.server, 'loadAccount').mockResolvedValueOnce({
            balances: [{ asset_type: 'native', balance: '0.5' }],
        })

        await expect(
            stellar.checkSufficientBalance(
                'GD6W4QX7YJ7BPGY4F2JH2V7XQ4L7G4W7W6V7W6V7W6V7W6V7W6V7W6V7',
                1
            )
        ).rejects.toThrow(
            /insufficient xlm balance/i
        )
    })
})

