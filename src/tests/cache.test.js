import { describe, it, expect, beforeEach } from 'vitest'

const cache = {}
const setCache = (key, val) => {
    cache[key] = { val, time: Date.now() }
}
const getCache = (key, ttl = 60000) => {
    const entry = cache[key]
    if (!entry) return null
    if (Date.now() - entry.time > ttl) return null
    return entry.val
}

describe('Cache', () => {
    beforeEach(() => {
        Object.keys(cache).forEach((k) => delete cache[k])
    })

    it('stores and retrieves a value', () => {
        setCache('btc', 50000)
        expect(getCache('btc')).toBe(50000)
    })

    it('returns null for missing key', () => {
        expect(getCache('eth')).toBeNull()
    })
})

