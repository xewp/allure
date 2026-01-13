import AdminLog from "../models/AdminLog.js";

/**
 * Helper function to log admin actions
 * This should be called after successful admin operations
 * 
 * @param {Object} req - Express request object (must have adminData)
 * @param {String} action - Action description (e.g., "approved_model", "suspended_user")
 * @param {String} targetType - Type of target (e.g., "user", "model", "booking")
 * @param {String} targetId - MongoDB ObjectId of the target
 * @param {String} targetName - Name/identifier of the target for easy reference
 * @param {Object} details - Additional details about the action
 */
export const logAdminAction = async (
  req,
  action,
  targetType,
  targetId,
  targetName,
  details = {}
) => {
  try {
    // Only log if admin is authenticated
    if (!req.adminData || (!req.adminData.role === "admin" && !req.adminData.role === "superadmin")) {
      return;
    }

    const log = new AdminLog({
      adminId: req.adminData._id,
      adminName: req.adminData.username || req.adminData.email,
      action,
      targetType,
      targetId,
      targetName,
      details,
      ipAddress: req.ip || req.connection.remoteAddress || "unknown",
    });

    // Save log asynchronously - don't await to avoid blocking main operations
    log.save().catch((error) => {
      console.error("Error saving admin log:", error);
      // Don't throw - logging failures should not break main operations
    });
  } catch (error) {
    console.error("Error in logAdminAction:", error);
    // Don't throw - logging should not break main operations
  }
};
