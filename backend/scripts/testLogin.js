import mongoose from "mongoose";
import bcrypt from "bcrypt";
import AdminUser from "../src/models/AdminUser.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/power-allure";

async function testLogin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB\n");

    const username = "superwis";
    const password = "testtest123";

    console.log(`Testing login for username: ${username}`);
    console.log(`Password: ${password}\n`);

    // Find user
    const user = await AdminUser.findOne({ username });

    if (!user) {
      console.log("❌ User not found!");
      return;
    }

    console.log("✅ User found!");
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Password hash: ${user.password.substring(0, 20)}...`);

    // Test password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      console.log("\n✅ PASSWORD MATCH! Login should work.");
    } else {
      console.log("\n❌ PASSWORD MISMATCH! Login will fail.");
      
      // Try testing if it might be bcryptjs hash
      const bcryptjs = await import('bcryptjs');
      const isMatchJs = await bcryptjs.default.compare(password, user.password);
      if (isMatchJs) {
        console.log("⚠️  Password was hashed with bcryptjs instead of bcrypt!");
      }
    }

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

testLogin();
