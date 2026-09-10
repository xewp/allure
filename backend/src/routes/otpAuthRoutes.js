import express from 'express';
import { registerWithOTP, verifyOTP, resendOTP, loginWithOTP } from '../controllers/otpAuthController.js';
import { verifyOTPLimiter, resendOTPLimiter } from '../middleware/rateLimiter.js';
import { loginSecurityMiddleware, registrationSecurityMiddleware } from '../middleware/authSecurity.js';

const router = express.Router();

/**
 * @route   POST /api/otp-auth/register
 * @desc    Register new user with OTP verification
 * @access  Public
 * @security registrationSecurityMiddleware (rate limit, disposable email, password strength, username validation)
 */
router.post('/register', registrationSecurityMiddleware, registerWithOTP);

/**
 * @route   POST /api/otp-auth/verify-otp
 * @desc    Verify OTP code
 * @access  Public
 */
router.post('/verify-otp', verifyOTPLimiter, verifyOTP);

/**
 * @route   POST /api/otp-auth/resend-otp
 * @desc    Resend OTP code
 * @access  Public
 */
router.post('/resend-otp', resendOTPLimiter, resendOTP);

/**
 * @route   POST /api/otp-auth/login
 * @desc    Login with email verification and approval checks
 * @access  Public
 * @security loginSecurityMiddleware (IP rate limit, account lock, progressive lockout)
 */
router.post('/login', loginSecurityMiddleware, loginWithOTP);

export default router;

