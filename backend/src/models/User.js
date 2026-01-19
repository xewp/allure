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
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email address",
    ],
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    min: [18, "Must be at least 18 years old"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  favorites: [
    {
      modelId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: false, // Changed to false to support existing data
      },
      password: {
        type: String,
        required: false, // Changed to false to support existing data
      },
      imageUrl: {
        type: String,
      },
      category: {
        type: String,
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  // OTP Verification Fields
  otpHash: {
    type: String,
    default: null,
  },
  otpExpiresAt: {
    type: Date,
    default: null,
  },
  otpAttempts: {
    type: Number,
    default: 0,
  },
  lastOtpRequestAt: {
    type: Date,
    default: null,
  },
  otpResendCount: {
    type: Number,
    default: 0,
  },

  // Email Verification
  emailVerified: {
    type: Boolean,
    default: false,
  },

  // Admin Approval
  isApproved: {
    type: Boolean,
    default: false,
  },
  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  // Session Management
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

  // Account Status & Permissions
  suspended: {
    type: Boolean,
    default: false,
  },
  
  // Model Access Control (managed by superadmin)
  canViewModels: {
    type: Boolean,
    default: false, // New users cannot view models by default (requires admin approval)
  },

  // Suspension
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

  // Password Reset
  passwordResetToken: {
    type: String,
    default: null,
  },
  passwordResetExpires: {
    type: Date,
    default: null,
  },
});

const User = mongoose.model("User", userSchema, "Users");

export default User;
