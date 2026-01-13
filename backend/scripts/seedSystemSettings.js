import mongoose from "mongoose";
import AdminUser from "../src/models/AdminUser.js";
import SystemSettings from "../src/models/SystemSettings.js";

// MongoDB connection string - update with your connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/power-allure";

// Default system settings
const defaultSettings = [
  {
    key: "maintenance_mode",
    value: false,
    description: "Enable/disable maintenance mode for the platform",
  },
  {
    key: "default_commission_percentage",
    value: 20,
    description: "Default commission percentage for bookings",
  },
  {
    key: "enable_signups",
    value: true,
    description: "Enable/disable new user registrations",
  },
  {
    key: "announcement_banner",
    value: "",
    description: "Platform-wide announcement banner text",
  },
];

async function seedSystemSettings() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check and create each setting if it doesn't exist
    for (const setting of defaultSettings) {
      const existing = await SystemSettings.findOne({ key: setting.key });
      
      if (!existing) {
        await SystemSettings.create(setting);
        console.log(`✓ Created setting: ${setting.key} = ${setting.value}`);
      } else {
        console.log(`- Setting already exists: ${setting.key}`);
      }
    }

    console.log("\n✅ System settings seeded successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding system settings:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the seed function
seedSystemSettings();
