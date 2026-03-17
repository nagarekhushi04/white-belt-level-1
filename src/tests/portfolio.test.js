import { describe, it, expect } from 'vitest'

const calcTotal = (tokens) => tokens.reduce((sum, t) => sum + t.amount * t.price, 0)

describe('Portfolio', () => {
    it('calculates total value correctly', () => {
        const tokens = [
            { amount: 2, price: 1000 },
            { amount: 5, price: 200 },
        ]
        expect(calcTotal(tokens)).toBe(3000)
    })
})

