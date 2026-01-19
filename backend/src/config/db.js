import mongoose from "mongoose";
import { log } from "../utils/logger.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    log.database("MongoDB Connected");
  } catch (err) {
    log.error("MongoDB connection error", { error: err.message });
    process.exit(1);
  }
};
