import SystemSettings from "../models/SystemSettings.js";

/**
 * Middleware to check if the system is in maintenance mode
 * Blocks all client requests when maintenance mode is enabled
 * Admin routes should bypass this middleware
 */
export const checkMaintenanceMode = async (req, res, next) => {
  try {
    // Fetch maintenance mode setting from database
    const maintenanceSetting = await SystemSettings.findOne({
      key: "maintenance_mode",
    });

    // If maintenance mode is enabled, block the request
    if (maintenanceSetting && maintenanceSetting.value === true) {
      return res.status(503).json({
        success: false,
        message: "System is currently under maintenance. Please try again later.",
        maintenanceMode: true,
      });
    }

    // If not in maintenance mode, proceed to the next middleware
    next();
  } catch (error) {
    console.error("Error checking maintenance mode:", error);
    // If there's an error, allow the request to proceed (fail-open)
    // This prevents database issues from blocking the entire application
    next();
  }
};
