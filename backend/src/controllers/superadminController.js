import User from "../models/User.js";
import LocalModel from "../models/LocalModel.js";
import ForeignModel from "../models/ForeignModel.js";
import AdminUser from "../models/AdminUser.js";
import SystemSettings from "../models/SystemSettings.js";
import AdminLog from "../models/AdminLog.js";
import { logAdminAction } from "../middleware/logAdminAction.js";

/**
 * Get all users with search and pagination
 */
export const getAllUsers = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      User.find(searchQuery)
        .select("-password -activeSessionToken")
        .populate("suspendedBy", "username email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(searchQuery),
    ]);

    res.json({
      success: true,
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

/**
 * Toggle user suspension status
 */
export const toggleUserSuspension = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Toggle suspension
    const newSuspendedStatus = !user.suspended;
    user.suspended = newSuspendedStatus;
    user.suspendedAt = newSuspendedStatus ? new Date() : null;
    user.suspendedBy = newSuspendedStatus ? req.adminData._id : null;

    // Clear session if suspending
    if (newSuspendedStatus) {
      user.activeSessionToken = null;
      user.sessionCreatedAt = null;
    }

    await user.save();

    // Log the action
    await logAdminAction(
      req,
      newSuspendedStatus ? "suspended_user" : "unsuspended_user",
      "user",
      user._id,
      `${user.firstName} ${user.lastName} (${user.email})`,
      {
        previousStatus: !newSuspendedStatus,
        newStatus: newSuspendedStatus,
      }
    );

    res.json({
      success: true,
      message: `User ${newSuspendedStatus ? "suspended" : "unsuspended"} successfully`,
      user: {
        _id: user._id,
        suspended: user.suspended,
        suspendedAt: user.suspendedAt,
      },
    });
  } catch (error) {
    console.error("Error toggling user suspension:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user suspension status",
      error: error.message,
    });
  }
};

/**
 * Get pending models (both local and foreign)
 */
export const getPendingModels = async (req, res) => {
  try {
    const [localModels, foreignModels] = await Promise.all([
      LocalModel.find({ approvalStatus: "pending" }).sort({ createdAt: -1 }),
      ForeignModel.find({ approvalStatus: "pending" }).sort({ createdAt: -1 }),
    ]);

    const models = [
      ...localModels.map((m) => ({ ...m.toObject(), category: "local" })),
      ...foreignModels.map((m) => ({ ...m.toObject(), category: "foreign" })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      models,
      count: models.length,
    });
  } catch (error) {
    console.error("Error fetching pending models:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending models",
      error: error.message,
    });
  }
};

/**
 * Approve a model
 */
export const approveModel = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body; // "local" or "foreign"

    const Model = category === "local" ? LocalModel : ForeignModel;
    const model = await Model.findById(id);

    if (!model) {
      return res.status(404).json({
        success: false,
        message: "Model not found",
      });
    }

    model.approvalStatus = "approved";
    model.approvedBy = req.adminData._id;
    model.approvedAt = new Date();
    await model.save();

    // Log the action
    await logAdminAction(
      req,
      "approved_model",
      "model",
      model._id,
      `${model.name} (${category})`,
      {
        category,
        previousStatus: "pending",
      }
    );

    res.json({
      success: true,
      message: "Model approved successfully",
      model,
    });
  } catch (error) {
    console.error("Error approving model:", error);
    res.status(500).json({
      success: false,
      message: "Failed to approve model",
      error: error.message,
    });
  }
};

/**
 * Reject a model
 */
export const rejectModel = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body; // "local" or "foreign"

    const Model = category === "local" ? LocalModel : ForeignModel;
    const model = await Model.findById(id);

    if (!model) {
      return res.status(404).json({
        success: false,
        message: "Model not found",
      });
    }

    model.approvalStatus = "rejected";
    model.approvedBy = req.adminData._id;
    model.approvedAt = new Date();
    await model.save();

    // Log the action
    await logAdminAction(
      req,
      "rejected_model",
      "model",
      model._id,
      `${model.name} (${category})`,
      {
        category,
        previousStatus: "pending",
      }
    );

    res.json({
      success: true,
      message: "Model rejected successfully",
      model,
    });
  } catch (error) {
    console.error("Error rejecting model:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reject model",
      error: error.message,
    });
  }
};

/**
 * Toggle model featured status
 */
export const toggleModelFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body; // "local" or "foreign"

    const Model = category === "local" ? LocalModel : ForeignModel;
    const model = await Model.findById(id);

    if (!model) {
      return res.status(404).json({
        success: false,
        message: "Model not found",
      });
    }

    const newFeaturedStatus = !model.featured;
    model.featured = newFeaturedStatus;
    await model.save();

    // Log the action
    await logAdminAction(
      req,
      newFeaturedStatus ? "featured_model" : "unfeatured_model",
      "model",
      model._id,
      `${model.name} (${category})`,
      {
        category,
        previousStatus: !newFeaturedStatus,
      }
    );

    res.json({
      success: true,
      message: `Model ${newFeaturedStatus ? "featured" : "unfeatured"} successfully`,
      model,
    });
  } catch (error) {
    console.error("Error toggling model featured status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update model featured status",
      error: error.message,
    });
  }
};

/**
 * Get all system settings
 */
export const getSystemSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.find().populate(
      "updatedBy",
      "username email"
    );

    // Convert to key-value object for easier frontend usage
    const settingsObject = {};
    settings.forEach((setting) => {
      settingsObject[setting.key] = {
        value: setting.value,
        description: setting.description,
        updatedBy: setting.updatedBy,
        updatedAt: setting.updatedAt,
      };
    });

    res.json({
      success: true,
      settings: settingsObject,
    });
  } catch (error) {
    console.error("Error fetching system settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch system settings",
      error: error.message,
    });
  }
};

/**
 * Update system settings
 */
export const updateSystemSettings = async (req, res) => {
  try {
    const { settings } = req.body; // { key: value, key: value, ... }

    if (!settings || typeof settings !== "object") {
      return res.status(400).json({
        success: false,
        message: "Invalid settings format",
      });
    }

    const updatedSettings = [];

    for (const [key, value] of Object.entries(settings)) {
      const setting = await SystemSettings.findOneAndUpdate(
        { key },
        {
          value,
          updatedBy: req.adminData._id,
          updatedAt: new Date(),
        },
        { upsert: true, new: true }
      );
      updatedSettings.push(setting);
    }

    // Log the action
    await logAdminAction(
      req,
      "updated_system_settings",
      "system",
      null,
      "System Settings",
      {
        updatedKeys: Object.keys(settings),
        changes: settings,
      }
    );

    res.json({
      success: true,
      message: "System settings updated successfully",
      settings: updatedSettings,
    });
  } catch (error) {
    console.error("Error updating system settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update system settings",
      error: error.message,
    });
  }
};

/**
 * Get admin logs with filtering and pagination
 */
export const getAdminLogs = async (req, res) => {
  try {
    const {
      adminId,
      action,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = req.query;

    const skip = (page - 1) * limit;

    // Build filter query
    const filter = {};
    if (adminId) filter.adminId = adminId;
    if (action) filter.action = action;
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const [logs, total] = await Promise.all([
      AdminLog.find(filter)
        .populate("adminId", "username email role")
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      AdminLog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching admin logs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin logs",
      error: error.message,
    });
  }
};

/**
 * Get detailed log entry
 */
export const getAdminLogDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const log = await AdminLog.findById(id).populate(
      "adminId",
      "username email role"
    );

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Log not found",
      });
    }

    res.json({
      success: true,
      log,
    });
  } catch (error) {
    console.error("Error fetching log details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch log details",
      error: error.message,
    });
  }
};

/**
 * Get list of all admins for filtering
 */
export const getAdminsList = async (req, res) => {
  try {
    const admins = await AdminUser.find()
      .select("username email role")
      .sort({ username: 1 });

    res.json({
      success: true,
      admins,
    });
  } catch (error) {
    console.error("Error fetching admins list:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admins list",
      error: error.message,
    });
  }
};

/**
 * Get superadmin dashboard stats
 */
export const getSuperadminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      suspendedUsers,
      totalLocalModels,
      totalForeignModels,
      pendingModels,
      featuredModels,
      recentLogs,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ suspended: true }),
      LocalModel.countDocuments(),
      ForeignModel.countDocuments(),
      Promise.all([
        LocalModel.countDocuments({ approvalStatus: "pending" }),
        ForeignModel.countDocuments({ approvalStatus: "pending" }),
      ]).then(([local, foreign]) => local + foreign),
      Promise.all([
        LocalModel.countDocuments({ featured: true }),
        ForeignModel.countDocuments({ featured: true }),
      ]).then(([local, foreign]) => local + foreign),
      AdminLog.find()
        .sort({ timestamp: -1 })
        .limit(5)
        .populate("adminId", "username email"),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        suspendedUsers,
        totalModels: totalLocalModels + totalForeignModels,
        totalLocalModels,
        totalForeignModels,
        pendingModels,
        featuredModels,
      },
      recentLogs,
    });
  } catch (error) {
    console.error("Error fetching superadmin stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch superadmin stats",
      error: error.message,
    });
  }
};
