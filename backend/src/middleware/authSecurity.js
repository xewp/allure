/**
 * Auth Security Middleware
 *
 * Two middleware functions that execute BEFORE controllers to reject
 * abusive requests before any expensive operations (DB queries, bcrypt, JWT).
 *
 * 1. loginSecurityMiddleware  — for login endpoints
 * 2. registrationSecurityMiddleware — for registration endpoints
 */

import { resolveClientIP } from '../utils/ipResolver.js';
import { checkLoginRateLimit } from '../services/security/loginRateLimiter.js';
import { checkAccountLock } from '../services/security/accountLockService.js';
import { checkRegistrationRateLimit, recordRegistrationAttempt } from '../services/security/registrationRateLimiter.js';
import { validateEmail } from '../services/security/disposableEmailChecker.js';
import { validatePasswordStrength, validateUsername } from '../services/security/authValidator.js';
import securityLogger from '../services/security/securityLogger.js';

/**
 * Login Security Middleware
 *
 * Checks (in order, all before DB access):
 *   1. Resolve real client IP
 *   2. IP-level rate limit → 429
 *   3. Account-level lock (by email/username from body) → 429
 *   4. Attach security context to req for controller use
 */
export const loginSecurityMiddleware = (req, res, next) => {
  try {
    const ip = resolveClientIP(req);
    const identifier = req.body?.email || req.body?.username || '';

    // Attach IP to request for downstream use
    req.clientIP = ip;

    // ── 1. Check IP rate limit ──
    const ipCheck = checkLoginRateLimit(ip);
    if (!ipCheck.allowed) {
      securityLogger.logRateLimit({
        ip,
        endpoint: req.originalUrl,
        attemptCount: 0,
      });

      return res.status(429).json({
        success: false,
        message: 'Too many login attempts. Please try again later.',
        remainingAttempts: 0,
        lockedUntil: ipCheck.lockedUntil,
      });
    }

    // ── 2. Check account-level lock ──
    if (identifier) {
      const accountCheck = checkAccountLock(identifier);
      if (accountCheck.locked) {
        securityLogger.logSuspiciousActivity({
          ip,
          reason: 'Login attempt on locked account',
          details: { identifier: identifier.slice(0, 3) + '***' },
          userAgent: req.get('user-agent'),
        });

        return res.status(429).json({
          success: false,
          message: 'Too many login attempts. Please try again later.',
          remainingAttempts: 0,
          lockedUntil: accountCheck.lockedUntil,
        });
      }
    }

    // ── 3. Attach security context ──
    req.securityContext = {
      ip,
      identifier,
      ipRemainingAttempts: ipCheck.remainingAttempts,
    };

    next();
  } catch (error) {
    // Security middleware should never crash the app — log and continue
    console.error('Login security middleware error:', error);
    next();
  }
};

/**
 * Registration Security Middleware
 *
 * Checks (in order, all before DB access):
 *   1. Resolve real client IP
 *   2. IP-level registration rate limit → 429
 *   3. Email format + disposable email check → 400
 *   4. Password strength validation → 400
 *   5. Username validation → 400
 */
export const registrationSecurityMiddleware = (req, res, next) => {
  try {
    const ip = resolveClientIP(req);
    req.clientIP = ip;

    // ── 1. Check registration rate limit ──
    const regCheck = checkRegistrationRateLimit(ip);
    if (!regCheck.allowed) {
      securityLogger.logRateLimit({
        ip,
        endpoint: req.originalUrl,
        attemptCount: 0,
      });

      return res.status(429).json({
        success: false,
        message: 'Too many registration attempts. Please try again later.',
      });
    }

    const { email, password, username } = req.body || {};

    // ── 2. Email validation + disposable check ──
    if (email) {
      const emailResult = validateEmail(email);
      if (!emailResult.valid) {
        if (emailResult.isDisposable) {
          securityLogger.logDisposableEmail({
            ip,
            email,
            domain: emailResult.domain,
          });

          return res.status(400).json({
            success: false,
            message: 'Disposable email addresses are not allowed.',
          });
        }

        return res.status(400).json({
          success: false,
          message: emailResult.error || 'Please provide a valid email address',
        });
      }

      // Normalize email on the request body for downstream use
      req.body.email = emailResult.normalized;
    }

    // ── 3. Password strength ──
    if (password) {
      const pwResult = validatePasswordStrength(password);
      if (!pwResult.valid) {
        return res.status(400).json({
          success: false,
          message: pwResult.errors[0],
          passwordErrors: pwResult.errors,
        });
      }
    }

    // ── 4. Username validation ──
    if (username) {
      const usernameResult = validateUsername(username);
      if (!usernameResult.valid) {
        return res.status(400).json({
          success: false,
          message: usernameResult.error,
        });
      }
    }

    // ── 5. Record the registration attempt (counts toward rate limit) ──
    recordRegistrationAttempt(ip);

    // Attach context
    req.securityContext = { ip };

    next();
  } catch (error) {
    console.error('Registration security middleware error:', error);
    next();
  }
};

export default {
  loginSecurityMiddleware,
  registrationSecurityMiddleware,
};
