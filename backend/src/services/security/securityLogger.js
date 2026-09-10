/**
 * Security Logger
 * Extends the existing Winston-based logger with security-specific methods.
 * Logs authentication events with structured metadata.
 * NEVER logs passwords or sensitive tokens.
 */

import { log } from '../../utils/logger.js';

const securityLogger = {
  /**
   * Log a login attempt (success or failure).
   */
  logLoginAttempt({ ip, email, success, attemptCount, userAgent, reason }) {
    const level = success ? 'info' : 'warn';
    const message = success
      ? `Login successful: ${maskEmail(email)}`
      : `Login failed: ${maskEmail(email)} — ${reason || 'invalid credentials'}`;

    log[level](message, {
      event: 'LOGIN_ATTEMPT',
      ip,
      email: maskEmail(email),
      success,
      attemptCount,
      userAgent: truncateUA(userAgent),
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Log an account lock event.
   */
  logAccountLock({ ip, email, durationMinutes, reason }) {
    log.warn(`Account locked: ${maskEmail(email)} for ${durationMinutes}min`, {
      event: 'ACCOUNT_LOCK',
      ip,
      email: maskEmail(email),
      durationMinutes,
      reason: reason || 'too many failed attempts',
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Log a rate limit hit.
   */
  logRateLimit({ ip, endpoint, attemptCount }) {
    log.warn(`Rate limit exceeded: ${ip} on ${endpoint}`, {
      event: 'RATE_LIMIT',
      ip,
      endpoint,
      attemptCount,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Log suspicious activity.
   */
  logSuspiciousActivity({ ip, reason, details, userAgent }) {
    log.warn(`Suspicious activity: ${reason}`, {
      event: 'SUSPICIOUS_ACTIVITY',
      ip,
      reason,
      details,
      userAgent: truncateUA(userAgent),
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Log a registration attempt.
   */
  logRegistrationAttempt({ ip, email, success, reason, userAgent }) {
    const level = success ? 'info' : 'warn';
    const message = success
      ? `Registration successful: ${maskEmail(email)}`
      : `Registration blocked: ${maskEmail(email)} — ${reason}`;

    log[level](message, {
      event: 'REGISTRATION_ATTEMPT',
      ip,
      email: maskEmail(email),
      success,
      reason,
      userAgent: truncateUA(userAgent),
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Log a disposable email rejection.
   */
  logDisposableEmail({ ip, email, domain }) {
    log.warn(`Disposable email rejected: ${maskEmail(email)} (domain: ${domain})`, {
      event: 'DISPOSABLE_EMAIL',
      ip,
      email: maskEmail(email),
      domain,
      timestamp: new Date().toISOString(),
    });
  },
};

/**
 * Mask email for logging (show first 2 chars + domain).
 * e.g. "user@example.com" → "us***@example.com"
 */
function maskEmail(email) {
  if (!email) return '[unknown]';
  const [local, domain] = email.split('@');
  if (!domain) return email.slice(0, 2) + '***';
  const masked = local.slice(0, 2) + '***';
  return `${masked}@${domain}`;
}

/**
 * Truncate user-agent to prevent log bloat.
 */
function truncateUA(ua) {
  if (!ua) return '[unknown]';
  return ua.length > 120 ? ua.slice(0, 120) + '…' : ua;
}

export default securityLogger;
