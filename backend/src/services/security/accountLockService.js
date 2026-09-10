/**
 * Account Lock Service
 *
 * Tracks failed login attempts per account (email/username) independently of IP.
 * Prevents distributed brute-force attacks using multiple IP addresses.
 *
 * Keys used in store:
 *   - `account:{identifier}:attempts`    → number of failed attempts
 *   - `account:{identifier}:lockedUntil` → ISO timestamp when lock expires
 */

import { getStore } from './storeFactory.js';
import securityConfig from '../../config/security.config.js';
import securityLogger from './securityLogger.js';

const { accountLock } = securityConfig;

/**
 * Check if an account is currently locked.
 * @param {string} identifier  Email or username (lowercased)
 * @returns {{ locked: boolean, lockedUntil: string|null, remainingAttempts: number }}
 */
export const checkAccountLock = (identifier) => {
  if (!identifier) return { locked: false, lockedUntil: null, remainingAttempts: accountLock.maxAttempts };

  const store = getStore();
  const key = normalizeKey(identifier);
  const lockKey = `account:${key}:lockedUntil`;
  const attemptsKey = `account:${key}:attempts`;

  // Check if currently locked
  const lockedUntil = store.get(lockKey);
  if (lockedUntil) {
    const lockExpiry = new Date(lockedUntil);
    if (lockExpiry > new Date()) {
      return { locked: true, lockedUntil, remainingAttempts: 0 };
    }
    // Lock expired — clean up
    store.delete(lockKey);
    store.delete(attemptsKey);
  }

  const attempts = store.get(attemptsKey) || 0;
  const remaining = Math.max(0, accountLock.maxAttempts - attempts);

  return {
    locked: false,
    lockedUntil: null,
    remainingAttempts: remaining === 0 && attempts === 0 ? accountLock.maxAttempts : remaining,
  };
};

/**
 * Record a failed login attempt for an account.
 * Locks the account if max attempts exceeded.
 * @param {string} identifier  Email or username
 * @param {string} ip          For logging purposes
 * @returns {{ locked: boolean, lockedUntil: string|null, remainingAttempts: number }}
 */
export const recordAccountFailure = (identifier, ip) => {
  if (!identifier) return { locked: false, lockedUntil: null, remainingAttempts: accountLock.maxAttempts };

  const store = getStore();
  const key = normalizeKey(identifier);
  const attemptsKey = `account:${key}:attempts`;
  const lockKey = `account:${key}:lockedUntil`;
  const windowMs = accountLock.lockMinutes * 60 * 1000;

  // Increment attempts (window = lock duration, so it auto-cleans)
  const attempts = store.increment(attemptsKey, windowMs);
  const remaining = Math.max(0, accountLock.maxAttempts - attempts);

  if (attempts >= accountLock.maxAttempts) {
    const lockedUntil = new Date(Date.now() + windowMs).toISOString();
    store.set(lockKey, lockedUntil, windowMs);
    store.delete(attemptsKey);

    securityLogger.logAccountLock({
      ip,
      email: identifier,
      durationMinutes: accountLock.lockMinutes,
      reason: 'Account-level lock — distributed brute-force protection',
    });

    return { locked: true, lockedUntil, remainingAttempts: 0 };
  }

  return { locked: false, lockedUntil: null, remainingAttempts: remaining };
};

/**
 * Reset account lock counters on successful login.
 * @param {string} identifier  Email or username
 */
export const resetAccountLock = (identifier) => {
  if (!identifier) return;
  const store = getStore();
  const key = normalizeKey(identifier);
  store.delete(`account:${key}:attempts`);
  store.delete(`account:${key}:lockedUntil`);
};

/**
 * Normalize the identifier to a consistent key format.
 */
function normalizeKey(identifier) {
  return identifier.toLowerCase().trim();
}

export default {
  checkAccountLock,
  recordAccountFailure,
  resetAccountLock,
};
