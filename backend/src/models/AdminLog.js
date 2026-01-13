import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUser",
    required: true,
  },
  adminName: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
    index: true,
  },
  targetType: {
    type: String,
    required: true,
    enum: ["user", "model", "booking", "system", "admin"],
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  targetName: {
    type: String,
  },
  details: {
    type: Object,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  ipAddress: {
    type: String,
  },
});

// Index for efficient querying
adminLogSchema.index({ adminId: 1, timestamp: -1 });
adminLogSchema.index({ action: 1, timestamp: -1 });

const AdminLog = mongoose.model("AdminLog", adminLogSchema, "AdminLogs");

export default AdminLog;
