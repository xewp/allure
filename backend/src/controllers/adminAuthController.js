import AdminUser from "../models/AdminUser.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const adminLogin = async (req, res) => {
  try {
    console.log("\n========== ADMIN LOGIN ATTEMPT ==========");
    console.log("Request body:", req.body);
    
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      console.log("[DEBUG] Missing username or password");
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
      console.log("[DEBUG] Username was sanitized, original:", username, "sanitized:", sanitizedUsername);
      return res.status(400).json({
        success: false,
        message: "Username contains invalid characters",
      });
    }

    // Find admin user by username
    console.log("[DEBUG] Searching for username:", sanitizedUsername);
    console.log("[DEBUG] Collection:", AdminUser.collection.name);
    console.log("[DEBUG] Database:", AdminUser.db.databaseName);
    
    // First, let's see how many users exist total
    const totalCount = await AdminUser.countDocuments();
    console.log("[DEBUG] Total AdminUsers in database:", totalCount);
    
    // Try to find the specific user
    const adminUser = await AdminUser.findOne({ username: sanitizedUsername });
    console.log("[DEBUG] Login attempt for username:", sanitizedUsername);
    console.log("[DEBUG] User found:", !!adminUser);
    
    // If not found, let's see what usernames actually exist
    if (!adminUser) {
      const allUsers = await AdminUser.find({}).select('username').limit(10);
      console.log("[DEBUG] Available usernames:", allUsers.map(u => u.username));
      console.log("[DEBUG] User not found in database");
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    console.log("[DEBUG] User details - username:", adminUser.username, "role:", adminUser.role);
    console.log("[DEBUG] Password from request length:", password.length);
    console.log("[DEBUG] Password hash from DB:", adminUser.password?.substring(0, 20));

    // Check password
    const isMatch = await bcrypt.compare(password, adminUser.password);
    console.log("[DEBUG] Password match result:", isMatch);
    
    if (!isMatch) {
      console.log("[DEBUG] Password mismatch - login failed");
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

    // Successful login
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
    console.error("Admin login error:", error);
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
