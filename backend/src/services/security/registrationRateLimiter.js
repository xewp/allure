/**
 * Registration Rate Limiter
 *
 * IP-based rate limiting for the registration endpoint.
 * Prevents spam account creation.
 *
 * Keys used in store:
 *   - `register:ip:{ip}:attempts` → number of registrations in window
 */

import { getStore } from './storeFactory.js';
import securityConfig from '../../config/security.config.js';
import securityLogger from './securityLogger.js';

const { registration } = securityConfig;

/**
 * Check if an IP is allowed to register.
 * @param {string} ip
 * @returns {{ allowed: boolean, remainingAttempts: number }}
 */
export const checkRegistrationRateLimit = (ip) => {
  const store = getStore();
  const attemptsKey = `register:ip:${ip}:attempts`;

  const attempts = store.get(attemptsKey) || 0;
  const remaining = Math.max(0, registration.maxAttempts - attempts);

  return {
    allowed: attempts < registration.maxAttempts,
    remainingAttempts: remaining,
  };
};

/**
 * Record a registration attempt for an IP.
 * @param {string} ip
 * @returns {{ allowed: boolean, remainingAttempts: number }}
 */
export const recordRegistrationAttempt = (ip) => {
  const store = getStore();
  const attemptsKey = `register:ip:${ip}:attempts`;
  const windowMs = registration.windowMinutes * 60 * 1000;

  const attempts = store.increment(attemptsKey, windowMs);
  const remaining = Math.max(0, registration.maxAttempts - attempts);

  if (attempts > registration.maxAttempts) {
    securityLogger.logRateLimit({
      ip,
      endpoint: 'register',
      attemptCount: attempts,
    });
  }

  return {
    allowed: attempts <= registration.maxAttempts,
    remainingAttempts: remaining,
  };
};

export default {
  checkRegistrationRateLimit,
  recordRegistrationAttempt,
};
