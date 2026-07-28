import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import AdminUser from "../src/models/AdminUser.js";

// Load environment variables (must be at top before other imports use them)
dotenv.config();

const createAdminUser = async () => {
  try {
    // Check if MONGO_URI is set
    if (!process.env.MONGO_URI) {
      console.error("❌ Error: MONGO_URI is not set in .env file");
      process.exit(1);
    }

    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB successfully!");

    // Check if admin already exists
    const existingAdmin = await AdminUser.findOne({ username: "admin" });
    
    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      console.log("Username:", existingAdmin.username);
      console.log("Email:", existingAdmin.email);
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create admin user
    const adminPassword = "admin123"; // Change this to a secure password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const adminUser = new AdminUser({
      username: "admin",
      password: hashedPassword,
      email: "admin@auraselect.com",
      role: "admin",
    });

    await adminUser.save();

    console.log("✅ Admin user created successfully!");
    console.log("==========================================");
    console.log("Username: admin");
    console.log("Password: admin123");
    console.log("Email: admin@auraselect.com");
    console.log("==========================================");
    console.log("⚠️  IMPORTANT: Change this password after first login!");

    // Close connection
    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    process.exit(1);
  }
};

// Run the script
createAdminUser();
