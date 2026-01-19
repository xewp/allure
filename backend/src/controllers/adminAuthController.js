import AdminUser from "../models/AdminUser.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { log } from "../utils/logger.js";

export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      log.warn("Admin login attempt with missing credentials");
      return res.status(400).json({
        success: false,
        message: "Please provide both username and password",
      });
    }

    // Input sanitization - limit length and check for dangerous characters
    if (username.length > 50 || password.length > 100) {
      log.warn("Admin login attempt with invalid input length", { username });
      return res.status(400).json({
        success: false,
        message: "Invalid input length",
      });
    }

    // Sanitize username - only allow alphanumeric and certain special chars
    const sanitizedUsername = username.replace(/[^\w\-_.]/g, '');
    
    if (sanitizedUsername !== username) {
      log.warn("Admin login attempt with invalid characters in username");
      return res.status(400).json({
        success: false,
        message: "Username contains invalid characters",
      });
    }

    // Find admin user by username
    const adminUser = await AdminUser.findOne({ username: sanitizedUsername });
    
    if (!adminUser) {
      log.warn("Failed admin login attempt - user not found", { username: sanitizedUsername });
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, adminUser.password);
    
    if (!isMatch) {
      log.warn("Failed admin login attempt - invalid password", { username: sanitizedUsername });
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    // Create and sign a JWT with admin role
    const token = jwt.sign(
      { 
        id: adminUser._id,
        role: adminUser.role,
        isAdmin: true
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    // Hash the token for storage (security best practice)
    const salt = await bcrypt.genSalt(10);
    const hashedToken = await bcrypt.hash(token, salt);

    // Store the hashed token and session info (this invalidates any previous session)
    adminUser.activeSessionToken = hashedToken;
    adminUser.sessionCreatedAt = new Date();
    adminUser.lastActivityAt = new Date();
    await adminUser.save();

    // Successful login - log without sensitive data
    log.info("Admin login successful", { 
      username: adminUser.username, 
      role: adminUser.role 
    });

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      user: {
        _id: adminUser._id,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (error) {
    log.error("Admin login error", { error: error.message });
    res.status(500).json({
      success: false,
      message: "Server error during admin login",
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

    // Fetch admin user
    const adminUser = await AdminUser.findById(decoded.id);

    if (!adminUser) {
      log.warn("Session validation failed - user not found", { userId: decoded.id });
      return res.status(401).json({
        success: false,
        message: "User not found",
        sessionInvalidated: true,
      });
    }

    // Check if there's an active session token stored
    if (!adminUser.activeSessionToken) {
      return res.status(401).json({
        success: false,
        message: "No active session",
        sessionInvalidated: true,
      });
    }

    // Verify the token matches the stored session
    const isValidSession = await bcrypt.compare(token, adminUser.activeSessionToken);

    if (!isValidSession) {
      log.warn("Session invalidated - token mismatch", { username: adminUser.username });
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
    log.error("Session validation error", { error: error.message });

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
