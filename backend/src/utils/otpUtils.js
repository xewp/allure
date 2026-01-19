import crypto from 'crypto';
import bcrypt from 'bcrypt';

/**
 * Generate a 6-digit numeric OTP
 * Uses crypto.randomInt for cryptographically secure random generation
 * @returns {string} 6-digit OTP
 */
export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Hash OTP using bcrypt before storing in database
 * @param {string} otp - Plain text OTP
 * @returns {Promise<string>} Hashed OTP
 */
export const hashOTP = async (otp) => {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
  return await bcrypt.hash(otp, saltRounds);
};

/**
 * Verify OTP using constant-time comparison to prevent timing attacks
 * @param {string} plainOTP - OTP provided by user
 * @param {string} hashedOTP - Hashed OTP from database
 * @returns {Promise<boolean>} True if OTP matches
 */
export const verifyOTP = async (plainOTP, hashedOTP) => {
  return await bcrypt.compare(plainOTP, hashedOTP);
};

/**
 * Check if OTP has expired
 * @param {Date} expiresAt - Expiration timestamp from database
 * @returns {boolean} True if OTP has expired
 */
export const isOTPExpired = (expiresAt) => {
  return new Date() > new Date(expiresAt);
};

/**
 * Get OTP expiration time in minutes from environment
 * @returns {number} Minutes until OTP expires
 */
export const getOTPExpiryMinutes = () => {
  return parseInt(process.env.OTP_EXPIRY_MINUTES) || 10;
};

/**
 * Calculate OTP expiration timestamp
 * @returns {Date} Expiration timestamp
 */
export const calculateOTPExpiry = () => {
  const expiryMinutes = getOTPExpiryMinutes();
  return new Date(Date.now() + expiryMinutes * 60 * 1000);
};
