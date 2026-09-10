/**
 * Login Rate Limiter with Progressive Lockout
 *
 * Tracks failed login attempts per IP in a rolling window.
 * Implements progressive lockout: escalating lock durations for repeat offenders.
 *
 * Keys used in store:
 *   - `login:ip:{ip}:attempts`     → number of failed attempts in current window
 *   - `login:ip:{ip}:lockedUntil`  → ISO timestamp when lock expires
 *   - `login:ip:{ip}:offenseCount` → number of times this IP has been locked
 */

import { getStore } from './storeFactory.js';
import securityConfig from '../../config/security.config.js';
import securityLogger from './securityLogger.js';

const { login, progressiveLockout } = securityConfig;

/**
 * Check if an IP is currently rate-limited or locked.
 * @param {string} ip
 * @returns {{ allowed: boolean, remainingAttempts: number, lockedUntil: string|null }}
 */
export const checkLoginRateLimit = (ip) => {
  const store = getStore();
  const lockKey = `login:ip:${ip}:lockedUntil`;
  const attemptsKey = `login:ip:${ip}:attempts`;

  // Check if currently locked
  const lockedUntil = store.get(lockKey);
  if (lockedUntil) {
    const lockExpiry = new Date(lockedUntil);
    if (lockExpiry > new Date()) {
      return {
        allowed: false,
        remainingAttempts: 0,
        lockedUntil,
      };
    }
    // Lock expired — clean up
    store.delete(lockKey);
  }

  // Check attempt count
  const attempts = store.get(attemptsKey) || 0;
  const remaining = Math.max(0, login.maxAttempts - attempts);

  return {
    allowed: remaining > 0 || attempts === 0,
    remainingAttempts: remaining === 0 && attempts === 0 ? login.maxAttempts : remaining,
    lockedUntil: null,
  };
};

/**
 * Record a failed login attempt for an IP.
 * If max attempts exceeded, apply progressive lockout.
 * @param {string} ip
 * @returns {{ remainingAttempts: number, lockedUntil: string|null }}
 */
export const recordFailedLogin = (ip) => {
  const store = getStore();
  const attemptsKey = `login:ip:${ip}:attempts`;
  const lockKey = `login:ip:${ip}:lockedUntil`;
  const offenseKey = `login:ip:${ip}:offenseCount`;
  const windowMs = login.windowMinutes * 60 * 1000;

  // Increment attempts
  const attempts = store.increment(attemptsKey, windowMs);
  const remaining = Math.max(0, login.maxAttempts - attempts);

  // Check if we need to lock
  if (attempts >= login.maxAttempts) {
    // Determine lock duration based on offense count
    const offenseCount = (store.get(offenseKey) || 0);
    const durations = progressiveLockout.durations;
    const durationIndex = Math.min(offenseCount, durations.length - 1);
    const lockMinutes = durations[durationIndex];
    const lockMs = lockMinutes * 60 * 1000;

    const lockedUntil = new Date(Date.now() + lockMs).toISOString();
    store.set(lockKey, lockedUntil, lockMs);

    // Increment offense count (persists for 24 hours)
    store.set(offenseKey, offenseCount + 1, 24 * 60 * 60 * 1000);

    // Clear attempts so they don't double-count on next window
    store.delete(attemptsKey);

    securityLogger.logRateLimit({
      ip,
      endpoint: 'login',
      attemptCount: attempts,
    });

    securityLogger.logAccountLock({
      ip,
      email: '[IP-level]',
      durationMinutes: lockMinutes,
      reason: `Progressive lockout — offense #${offenseCount + 1}`,
    });

    return { remainingAttempts: 0, lockedUntil };
  }

  return { remainingAttempts: remaining, lockedUntil: null };
};

/**
 * Reset login rate limit counters for an IP on successful login.
 * Also resets the progressive offense count.
 * @param {string} ip
 */
export const resetLoginRateLimit = (ip) => {
  const store = getStore();
  store.delete(`login:ip:${ip}:attempts`);
  store.delete(`login:ip:${ip}:lockedUntil`);
  store.delete(`login:ip:${ip}:offenseCount`);
};

export default {
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginRateLimit,
};
