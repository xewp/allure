import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    required: false, // Company is now optional
    trim: true,
  },
  event: {
    type: String,
    required: true,
    trim: true,
  },
  eventDate: {
    type: String,
    required: true,
  },
  eventTime: {
    type: String,
    required: true,
  },
  modelId: {
    type: String,
    required: true,
  },
  modelName: {
    type: String,
    required: true,
  },
  modelCategory: {
    type: String,
    enum: ["local", "foreign"],
    required: true,
  },
  modelImageUrl: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
bookingSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Booking = mongoose.model("Booking", bookingSchema, "Bookings");

export default Booking;
