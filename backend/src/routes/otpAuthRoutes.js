import express from 'express';
import { registerWithOTP, verifyOTP, resendOTP, loginWithOTP } from '../controllers/otpAuthController.js';
import { registerLimiter, verifyOTPLimiter, resendOTPLimiter, loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * @route   POST /api/otp-auth/register
 * @desc    Register new user with OTP verification
 * @access  Public
 */
router.post('/register', registerLimiter, registerWithOTP);

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
 */
router.post('/login', loginLimiter, loginWithOTP);

export default router;
