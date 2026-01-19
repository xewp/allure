import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateOTP, hashOTP, verifyOTP as verifyOTPUtil, isOTPExpired, calculateOTPExpiry } from '../utils/otpUtils.js';
import { sendOTPEmail } from '../services/emailService.js';

/**
 * Register a new user with OTP email verification
 * Generates OTP and sends verification email
 */
export const registerWithOTP = async (req, res) => {
  try {
    const { email, password, username, firstName, lastName, phoneNumber, age } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    //Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered',
      });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate OTP
    const otp = generateOTP();
    const otpHash = await hashOTP(otp);
    const otpExpiresAt = calculateOTPExpiry();

    // Create user
    const newUser = new User({
      email: email.toLowerCase(),
      password: passwordHash,
      username: username || email.split('@')[0],
      firstName: firstName || '',
      lastName: lastName || '',
      phoneNumber: phoneNumber || '',
      age: age || 18,
      otpHash,
      otpExpiresAt,
      otpAttempts: 0,
      otpResendCount: 0,
      lastOtpRequestAt: new Date(),
      emailVerified: false,
      isApproved: false,
      approvalStatus: 'pending',
      canViewModels: false, // New users cannot view models by default
    });

    await newUser.save();

    // Send OTP email
    try {
      await sendOTPEmail(newUser.email, otp);
    } catch (emailError) {
      console.error('Failed to send OTP email during registration:', emailError);
      // We don't block registration, but the user will need to resend
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! An OTP has been sent to your email for verification.',
      data: {
        email: newUser.email,
        userId: newUser._id,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
    });
  }
};

/**
 * Verify OTP code submitted by user
 * Marks email as verified upon success
 */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }

    // Find user by email OR username (same as login flow)
    const user = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: email }
      ]
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }

    // Check if OTP exists
    if (!user.otpHash || !user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new one.',
      });
    }

    // Check max attempts
    const maxAttempts = parseInt(process.env.MAX_OTP_ATTEMPTS) || 5;
    if (user.otpAttempts >= maxAttempts) {
      return res.status(429).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.',
      });
    }

    // Check if OTP expired
    if (isOTPExpired(user.otpExpiresAt)) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
    }

    // Verify OTP (constant-time comparison)
    const isValid = await verifyOTPUtil(otp, user.otpHash);
    
    if (!isValid) {
      // Increment failed attempts
      user.otpAttempts += 1;
      await user.save();

      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${maxAttempts - user.otpAttempts} attempts remaining.`,
      });
    }

    // OTP is valid - mark email as verified and clear OTP data
    user.emailVerified = true;
    user.otpHash = null;
    user.otpExpiresAt = null;
    user.otpAttempts = 0;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! Your account is awaiting admin approval.',
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Verification failed. Please try again.',
    });
  }
};

/**
 * Resend OTP to user's email
 * Invalidates previous OTP and generates a new one
 */
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Find user by email OR username (same as login flow)
    const user = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: email }
      ]
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }

    // Check resend cooldown (60 seconds)
    if (user.lastOtpRequestAt) {
      const cooldownSeconds = 60;
      const timeSinceLastRequest = (Date.now() - new Date(user.lastOtpRequestAt).getTime()) / 1000;
      
      if (timeSinceLastRequest < cooldownSeconds) {
        const remainingTime = Math.ceil(cooldownSeconds - timeSinceLastRequest);
        return res.status(429).json({
          success: false,
          message: `Please wait ${remainingTime} seconds before requesting a new OTP.`,
        });
      }
    }

    // Check max resend attempts per hour
    const maxResendPerHour = parseInt(process.env.MAX_OTP_RESEND_PER_HOUR) || 3;
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    if (user.lastOtpRequestAt && new Date(user.lastOtpRequestAt) > oneHourAgo) {
      if (user.otpResendCount >= maxResendPerHour) {
        return res.status(429).json({
          success: false,
          message: 'Maximum OTP resend limit reached. Please try again later.',
        });
      }
    } else {
      // Reset counter if more than an hour has passed
      user.otpResendCount = 0;
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpHash = await hashOTP(otp);
    const otpExpiresAt = calculateOTPExpiry();

    // Update user with new OTP
    user.otpHash = otpHash;
    user.otpExpiresAt = otpExpiresAt;
    user.otpAttempts = 0; // Reset attempts
    user.otpResendCount += 1;
    user.lastOtpRequestAt = new Date();
    await user.save();

    // Send new OTP email (use user.email to ensure it goes to correct address)
    try {
      await sendOTPEmail(user.email, otp);
    } catch (emailError) {
      console.error('Email send failed:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'New OTP has been sent to your email.',
      data: {
        expiresIn: process.env.OTP_EXPIRY_MINUTES || 10,
      },
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP. Please try again.',
    });
  }
};

/**
 * Login with email verification and admin approval checks
 * Only allows login for verified AND approved users
 */
export const loginWithOTP = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/Username and password are required',
      });
    }

    // Find user by email OR username
    const user = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: email } // 'email' field contains either email or username
      ]
    });
    
    if (!user) {
      console.log(`Login attempt - User not found: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email/username or password',
      });
    }

    console.log(`Login attempt - User found: ${user.email}, emailVerified: ${user.emailVerified}, approvalStatus: ${user.approvalStatus}, isApproved: ${user.isApproved}`);

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`Password validation result: ${isPasswordValid}`);
    
    if (!isPasswordValid) {
      console.log(`Login failed - Invalid password for: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email/username or password',
      });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in.',
        requiresVerification: true,
      });
    }

    // Check if account is suspended
    if (user.suspended) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support.',
      });
    }

    // Check approval status
    if (user.approvalStatus === 'rejected') {
      return res.status(403).json({
        success: false,
        message: 'Your account registration was rejected. Please contact support for more information.',
      });
    }

    if (user.approvalStatus === 'pending' || !user.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Account not approved. Your account is awaiting admin approval.',
        requiresApproval: true,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: 'user',
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Update session token (for single-device session management)
    const sessionTokenHash = await bcrypt.hash(token, 10);
    user.activeSessionToken = sessionTokenHash;
    user.sessionCreatedAt = new Date();
    user.lastActivityAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
        canViewModels: user.canViewModels !== undefined ? user.canViewModels : true, // Default to true for backward compatibility
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
    });
  }
};
