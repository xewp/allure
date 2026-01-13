import mongoose from "mongoose";

const foreignModelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  description: { type: String },
  height: { type: String },
  weight: { type: String },
  imageUrl: { type: String, required: true },
  galleryImages: [{ type: String }],
  available: { type: Boolean, default: true },
  favoritesCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUser",
  },
  approvedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model("ForeignModel", foreignModelSchema, "Foreign");
