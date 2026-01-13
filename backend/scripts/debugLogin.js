import mongoose from "mongoose";
import bcrypt from "bcrypt";
import AdminUser from "../src/models/AdminUser.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/power-allure";

async function debugLogin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB\n");

    const username = "superwis";
    const password = "testtest123";

    console.log("=== Step-by-Step Login Debug ===\n");
    console.log(`1. Looking for username: "${username}"`);
    
    // Test with exact query the controller uses
    const sanitizedUsername = username.replace(/[^\w\-_.]/g, '');
    console.log(`   Sanitized username: "${sanitizedUsername}"`);
    console.log(`   Are they equal? ${sanitizedUsername === username}`);

    const adminUser = await AdminUser.findOne({ username: sanitizedUsername });
    
    if (!adminUser) {
      console.log("\n❌ User not found in database!");
      
      // Try finding all users to see what's there
      const allUsers = await AdminUser.find({});
      console.log("\nAll usernames in database:");
      allUsers.forEach(u => console.log(`   - "${u.username}"`));
      return;
    }

    console.log("\n2. ✅ User found!");
    console.log(`   Database username: "${adminUser.username}"`);
    console.log(`   Database email: "${adminUser.email}"`);
    console.log(`   Database role: "${adminUser.role}"`);
    console.log(`   Has password: ${!!adminUser.password}`);
    console.log(`   Password hash starts with: ${adminUser.password.substring(0, 7)}`);

    console.log(`\n3. Testing password: "${password}"`);
    console.log(`   Against hash: ${adminUser.password.substring(0, 30)}...`);
    
    const isMatch = await bcrypt.compare(password, adminUser.password);
    
    console.log(`\n4. Password comparison result: ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);

    if (!isMatch) {
      // Try the other user too
      console.log("\n   Trying 'superadmin' user...");
      const otherUser = await AdminUser.findOne({ username: "superadmin" });
      if (otherUser) {
        const isMatch2 = await bcrypt.compare("test123", otherUser.password);
        console.log(`   'superadmin' with password 'test123': ${isMatch2 ? '✅ MATCH' : '❌ NO MATCH'}`);
      }
    }

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

debugLogin();
