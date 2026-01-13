/**
 * Middleware to verify that the authenticated admin has superadmin role
 */
export const requireSuperadmin = (req, res, next) => {
  try {
    // Check if admin data exists (should be set by authenticateAdmin middleware)
    if (!req.adminData) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // Check if admin has superadmin role
    if (req.adminData.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Superadmin access required. This action requires elevated privileges.",
      });
    }

    // User is superadmin, proceed to next middleware/controller
    next();
  } catch (error) {
    console.error("Superadmin middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during authorization.",
    });
  }
};
