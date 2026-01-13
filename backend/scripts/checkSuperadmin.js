import mongoose from "mongoose";
import AdminUser from "../src/models/AdminUser.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/power-allure";

async function checkSuperadmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB\n");

    // Find all admin users
    const admins = await AdminUser.find({});
    
    console.log(`Total admin users found: ${admins.length}\n`);
    
    if (admins.length === 0) {
      console.log("❌ No admin users found in the database!");
    } else {
      console.log("=== Admin Users in Database ===\n");
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. Username: ${admin.username}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   ID: ${admin._id}`);
        console.log(`   Created: ${admin.createdAt}`);
        console.log(`   Has Password Hash: ${admin.password ? 'Yes' : 'No'}`);
        console.log(`   Password Hash Length: ${admin.password?.length || 0}`);
        console.log("");
      });
    }

    // Check collection name
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("=== Collections in Database ===");
    collections.forEach(col => {
      console.log(`- ${col.name}`);
    });

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

checkSuperadmin();
