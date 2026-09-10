/**
 * Centralized Security Configuration
 * All security thresholds are configurable via environment variables.
 * Defaults are production-safe values.
 */

const securityConfig = {
  // ── Login Rate Limiting ──
  login: {
    maxAttempts: parseInt(process.env.LOGIN_MAX_ATTEMPTS) || 5,
    windowMinutes: parseInt(process.env.LOGIN_WINDOW_MINUTES) || 10,
    delayMs: parseInt(process.env.LOGIN_DELAY_MS) || 750,
  },

  // ── Progressive Lockout (escalating lock durations) ──
  progressiveLockout: {
    // Comma-separated minutes: 1st offense, 2nd, 3rd, 4th+
    durations: (process.env.PROGRESSIVE_LOCKOUT_MINUTES || '10,30,60,1440')
      .split(',')
      .map((m) => parseInt(m.trim(), 10)),
  },

  // ── Account-Level Lock ──
  accountLock: {
    maxAttempts: parseInt(process.env.ACCOUNT_LOCK_MAX_ATTEMPTS) || 5,
    lockMinutes: parseInt(process.env.ACCOUNT_LOCK_MINUTES) || 15,
  },

  // ── Registration Rate Limiting ──
  registration: {
    maxAttempts: parseInt(process.env.REGISTER_MAX_ATTEMPTS) || 3,
    windowMinutes: parseInt(process.env.REGISTER_WINDOW_MINUTES) || 30,
  },

  // ── IP Block (global abuse threshold) ──
  ipBlock: {
    threshold: parseInt(process.env.IP_BLOCK_THRESHOLD) || 100,
    windowMinutes: parseInt(process.env.IP_BLOCK_WINDOW_MINUTES) || 60,
  },

  // ── Password Policy ──
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
  },

  // ── Redis ──
  redis: {
    url: process.env.REDIS_URL || null,
  },

  // ── Disposable Email ──
  disposableEmail: {
    additionalDomains: (process.env.ADDITIONAL_BLOCKED_DOMAINS || '')
      .split(',')
      .map((d) => d.trim().toLowerCase())
      .filter(Boolean),
  },
};

export default securityConfig;
