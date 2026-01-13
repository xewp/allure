import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema({
  key: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUser",
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const SystemSettings = mongoose.model(
  "SystemSettings",
  systemSettingsSchema,
  "SystemSettings"
);

export default SystemSettings;
