import 'dotenv/config';
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import readline from "readline";
import AdminUser from "../src/models/AdminUser.js";

// MongoDB connection string - update with your connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/power-allure";
console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Promisify readline question
const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

async function createSuperadmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB\n");

    console.log("=== Create Superadmin User ===\n");

    // Get user input
    const username = await question("Enter username: ");
    const email = await question("Enter email: ");
    const password = await question("Enter password: ");

    if (!username || !email || !password) {
      console.error("❌ All fields are required!");
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await AdminUser.findOne({
      $or: [{ username }, { email }],
    });

    let superadmin;

    if (existingUser) {
      console.log(`\n⚠️  User found: ${existingUser.username} (${existingUser.email})`);
      const update = await question("Update to superadmin? (yes/no): ");

      if (update.toLowerCase() === "yes" || update.toLowerCase() === "y") {
        existingUser.role = "superadmin";
        
        // Update password if provided
        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          existingUser.password = hashedPassword;
        }
        
        superadmin = await existingUser.save();
        console.log("\n✅ User updated to superadmin successfully!");
      } else {
        console.log("Operation cancelled.");
        process.exit(0);
      }
    } else {
      // Create new superadmin user
      const hashedPassword = await bcrypt.hash(password, 10);

      superadmin = await AdminUser.create({
        username,
        email,
        password: hashedPassword,
        role: "superadmin",
      });

      console.log("\n✅ Superadmin created successfully!");
    }

    console.log("\n=== Superadmin Details ===");
    console.log(`ID: ${superadmin._id}`);
    console.log(`Username: ${superadmin.username}`);
    console.log(`Email: ${superadmin.email}`);
    console.log(`Role: ${superadmin.role}`);
    console.log(`Created: ${superadmin.createdAt}`);

  } catch (error) {
    console.error("\n❌ Error creating superadmin:", error);
    process.exit(1);
  } finally {
    rl.close();
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

// Run the script
createSuperadmin();
