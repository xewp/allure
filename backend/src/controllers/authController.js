import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import SystemSettings from "../models/SystemSettings.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both username and password",
      });
    }

    // Input sanitization - limit length and check for dangerous characters
    if (username.length > 50 || password.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Invalid input length",
      });
    }

    // Sanitize username - only allow alphanumeric and certain special chars
    const sanitizedUsername = username.replace(/[^\w\-_.]/g, '');
    
    if (sanitizedUsername !== username) {
      return res.status(400).json({
        success: false,
        message: "Username contains invalid characters",
      });
    }

    // Find user by username
    const user = await User.findOne({ username: sanitizedUsername });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Check if user is suspended
    if (user.suspended) {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended. Please contact support for assistance.",
        suspended: true,
        suspendedAt: user.suspendedAt,
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Create and sign a JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Hash the token for storage (security best practice)
    const salt = await bcrypt.genSalt(10);
    const hashedToken = await bcrypt.hash(token, salt);

    // Store the hashed token and session info (this invalidates any previous session)
    user.activeSessionToken = hashedToken;
    user.sessionCreatedAt = new Date();
    user.lastActivityAt = new Date();
    await user.save();

    // Successful login
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        favorites: user.favorites,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

export const register = async (req, res) => {
  try {
    // Check if signups are enabled
    const signupSetting = await SystemSettings.findOne({ key: "enable_signups" });
    if (signupSetting && signupSetting.value === false) {
      return res.status(403).json({
        success: false,
        message: "New user registrations are currently disabled",
        signupsDisabled: true,
      });
    }

    const { username, password, firstName, lastName, email, phoneNumber, age } = req.body;

    // Validate all required fields
    if (!username || !password || !firstName || !lastName || !email || !phoneNumber || !age) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Input sanitization - limit length
    if (username.length > 50 || password.length > 100 || firstName.length > 50 || lastName.length > 50 || email.length > 100 || phoneNumber.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Invalid input length",
      });
    }

    // Password strength validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Sanitize username - only allow alphanumeric and certain special chars
    const sanitizedUsername = username.replace(/[^\w\-_.]/g, '');
    
    if (sanitizedUsername !== username) {
      return res.status(400).json({
        success: false,
        message: "Username contains invalid characters. Only letters, numbers, -, _, and . are allowed",
      });
    }

    // Email validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Age validation
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
      return res.status(400).json({
        success: false,
        message: "Age must be between 18 and 120",
      });
    }

    // Phone number validation - basic check
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid phone number",
      });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username: sanitizedUsername });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      username: sanitizedUsername,
      password: hashedPassword,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phoneNumber: phoneNumber.trim(),
      age: ageNum,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

export const validateSession = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
        sessionInvalidated: true,
      });
    }

    // Verify JWT signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Support both old token format (id) and new token format (userId)
    const userId = decoded.userId || decoded.id;
    
    // Fetch user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
        sessionInvalidated: true,
      });
    }

    // Check if there's an active session token stored
    if (!user.activeSessionToken) {
      return res.status(401).json({
        success: false,
        message: "No active session",
        sessionInvalidated: true,
      });
    }

    // Verify the token matches the stored session
    const isValidSession = await bcrypt.compare(token, user.activeSessionToken);

    if (!isValidSession) {
      return res.status(401).json({
        success: false,
        message: "Session has been invalidated by another login",
        sessionInvalidated: true,
      });
    }

    // Session is valid
    res.status(200).json({
      success: true,
      message: "Session is valid",
      sessionInvalidated: false,
    });
  } catch (error) {
    console.error("Session validation error:", error);

    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
        sessionInvalidated: true,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error during session validation",
    });
  }
};
