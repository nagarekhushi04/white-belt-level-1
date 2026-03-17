// src/utils/priceCache.js
const TTL_MS = 60 * 1000; // 60 seconds

export const priceCache = {
  get: (key) => {
    try {
      // 1. Check in-memory first (not really necessary if we just rely on localStorage, but good for speed)
      // We will just use localStorage for simplicity across reloads
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      const now = new Date().getTime();

      // 2. Check TTL
      if (now - item.timestamp > TTL_MS) {
        localStorage.removeItem(key);
        return null;
      }
      return { data: item.data, cached: true };
    } catch (err) {
      console.error("Cache read error:", err);
      return null;
    }
  },

  set: (key, data) => {
    try {
      const item = {
        data: data,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (err) {
      console.error("Cache write error:", err);
    }
  },

  clear: (key) => {
    localStorage.removeItem(key);
  }
};
