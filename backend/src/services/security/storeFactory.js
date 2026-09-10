/**
 * Store Factory
 * Returns the appropriate store instance based on environment configuration.
 * Currently returns MemoryStore. When REDIS_URL is set, will attempt Redis
 * and fall back to MemoryStore on connection failure.
 *
 * Singleton pattern — all security services share the same store instance.
 */

import MemoryStore from './memoryStore.js';
import securityConfig from '../../config/security.config.js';
import { log } from '../../utils/logger.js';

/** @type {MemoryStore|null} */
let storeInstance = null;

/**
 * Get or create the shared store instance.
 * @returns {MemoryStore} The store instance
 */
export const getStore = () => {
  if (storeInstance) return storeInstance;

  if (securityConfig.redis.url) {
    // Redis integration point — future enhancement
    // When implementing:
    //   1. import a Redis client (e.g. ioredis)
    //   2. Create a RedisStore class implementing the same interface
    //   3. Wrap in try/catch — fall back to MemoryStore on failure
    log.info('REDIS_URL configured but Redis adapter not yet implemented — using in-memory store');
  }

  storeInstance = new MemoryStore();
  log.info('Security store initialized (in-memory)');
  return storeInstance;
};

/**
 * Shutdown the store (for graceful shutdown / testing).
 */
export const shutdownStore = () => {
  if (storeInstance) {
    storeInstance.shutdown();
    storeInstance = null;
  }
};

export default getStore;
