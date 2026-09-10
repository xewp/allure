/**
 * In-Memory Store with automatic TTL cleanup.
 * Implements a common interface so it can be swapped with Redis later.
 *
 * Interface: get(key), set(key, value, ttlMs), increment(key, ttlMs),
 *            delete(key), has(key), cleanup(), shutdown()
 */

class MemoryStore {
  constructor() {
    /** @type {Map<string, { value: any, expiresAt: number }>} */
    this._store = new Map();

    // Run cleanup every 60 seconds to prevent memory leaks
    this._cleanupInterval = setInterval(() => this.cleanup(), 60_000);

    // Don't let the cleanup timer prevent Node from exiting
    if (this._cleanupInterval.unref) {
      this._cleanupInterval.unref();
    }
  }

  /**
   * Get a value by key. Returns null if expired or missing.
   * @param {string} key
   * @returns {any|null}
   */
  get(key) {
    const entry = this._store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this._store.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Set a value with a TTL in milliseconds.
   * @param {string} key
   * @param {any} value
   * @param {number} ttlMs  Time-to-live in milliseconds
   */
  set(key, value, ttlMs) {
    this._store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  /**
   * Increment a numeric value by 1. Creates with value 1 if missing.
   * Resets TTL on each increment.
   * @param {string} key
   * @param {number} ttlMs
   * @returns {number} The new count
   */
  increment(key, ttlMs) {
    const current = this.get(key);
    const newValue = (typeof current === 'number' ? current : 0) + 1;
    this.set(key, newValue, ttlMs);
    return newValue;
  }

  /**
   * Delete a key.
   * @param {string} key
   */
  delete(key) {
    this._store.delete(key);
  }

  /**
   * Check if a key exists and is not expired.
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Remove all expired entries.
   */
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this._store) {
      if (now > entry.expiresAt) {
        this._store.delete(key);
      }
    }
  }

  /**
   * Clear the cleanup timer and all data.
   */
  shutdown() {
    if (this._cleanupInterval) {
      clearInterval(this._cleanupInterval);
      this._cleanupInterval = null;
    }
    this._store.clear();
  }

  /**
   * Get the number of active (non-expired) entries.
   * @returns {number}
   */
  get size() {
    this.cleanup();
    return this._store.size;
  }
}

export default MemoryStore;
