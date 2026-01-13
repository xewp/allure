import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    min: [18, 'Must be at least 18 years old'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  favorites: [{
    modelId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: false  // Changed to false to support existing data
    },
    password: {
      type: String,
      required: false  // Changed to false to support existing data
    },
    imageUrl: {
      type: String
    },
    category: {
      type: String
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  activeSessionToken: {
    type: String,
    default: null,
  },
  sessionCreatedAt: {
    type: Date,
    default: null,
  },
  lastActivityAt: {
    type: Date,
    default: null,
  },
  suspended: {
    type: Boolean,
    default: false,
  },
  suspendedAt: {
    type: Date,
    default: null,
  },
  suspendedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUser",
    default: null,
  },
});

const User = mongoose.model("User", userSchema, "Users");

export default User;
