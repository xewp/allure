/**
 * Auth Validator
 *
 * Consolidated input validation for authentication endpoints.
 * Password strength, username sanitization, email normalization.
 */

import securityConfig from '../../config/security.config.js';

const { password: pwConfig } = securityConfig;

/**
 * Validate password strength against policy.
 * @param {string} password
 * @returns {{ valid: boolean, errors: string[] }}
 */
export const validatePasswordStrength = (password) => {
  const errors = [];

  if (!password || typeof password !== 'string') {
    return { valid: false, errors: ['Password is required'] };
  }

  if (password.length < pwConfig.minLength) {
    errors.push(`Password must be at least ${pwConfig.minLength} characters long`);
  }

  if (password.length > 100) {
    errors.push('Password must not exceed 100 characters');
  }

  if (pwConfig.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (pwConfig.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (pwConfig.requireNumber && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (pwConfig.requireSpecialChar && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate and sanitize a username.
 * Rejects HTML, JavaScript, SQL injection, and invalid characters.
 * @param {string} username
 * @returns {{ valid: boolean, sanitized: string|null, error: string|null }}
 */
export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    return { valid: false, sanitized: null, error: 'Username is required' };
  }

  const trimmed = username.trim();

  // Length check
  if (trimmed.length < 2) {
    return { valid: false, sanitized: null, error: 'Username must be at least 2 characters' };
  }

  if (trimmed.length > 50) {
    return { valid: false, sanitized: null, error: 'Username must not exceed 50 characters' };
  }

  // HTML/script injection detection
  const dangerousPatterns = [
    /<\s*script/i,
    /<\s*\/\s*script/i,
    /<[^>]*>/,                      // Any HTML tags
    /javascript\s*:/i,
    /on\w+\s*=/i,                   // Event handlers (onclick=, onerror=, etc.)
    /&#\d+;/,                       // HTML numeric entities
    /&#x[\da-f]+;/i,               // HTML hex entities
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(trimmed)) {
      return { valid: false, sanitized: null, error: 'Username contains invalid characters' };
    }
  }

  // SQL injection detection
  const sqlPatterns = [
    /'\s*(OR|AND|UNION|SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE)\s/i,
    /;\s*(DROP|DELETE|INSERT|UPDATE|ALTER)/i,
    /--\s/,                          // SQL comment
    /\/\*.*\*\//,                    // Block comment
    /'\s*=\s*'/,                     // Tautology
    /'\s*;\s*/,                      // Statement terminator after quote
  ];

  for (const pattern of sqlPatterns) {
    if (pattern.test(trimmed)) {
      return { valid: false, sanitized: null, error: 'Username contains invalid characters' };
    }
  }

  // Only allow alphanumeric, hyphens, underscores, periods
  const allowedPattern = /^[\w\-_.]+$/;
  if (!allowedPattern.test(trimmed)) {
    return {
      valid: false,
      sanitized: null,
      error: 'Username can only contain letters, numbers, hyphens, underscores, and periods',
    };
  }

  return { valid: true, sanitized: trimmed, error: null };
};

export default {
  validatePasswordStrength,
  validateUsername,
};
