import express from "express";
import { authenticateAdmin } from "../middleware/adminAuthMiddleware.js";
import { requireSuperadmin } from "../middleware/requireSuperadmin.js";
import {
  getAllUsers,
  toggleUserSuspension,
  getPendingModels,
  approveModel,
  rejectModel,
  toggleModelFeatured,
  getSystemSettings,
  updateSystemSettings,
  getAdminLogs,
  getAdminLogDetails,
  getAdminsList,
  getSuperadminStats,
} from "../controllers/superadminController.js";

const router = express.Router();

// All routes require admin authentication first, then superadmin role
router.use(authenticateAdmin);
router.use(requireSuperadmin);

// Dashboard stats
router.get("/stats", getSuperadminStats);

// User management
router.get("/users", getAllUsers);
router.put("/users/:id/suspend", toggleUserSuspension);

// Model management
router.get("/models/pending", getPendingModels);
router.post("/models/:id/approve", approveModel);
router.post("/models/:id/reject", rejectModel);
router.put("/models/:id/featured", toggleModelFeatured);

// System settings
router.get("/settings", getSystemSettings);
router.put("/settings", updateSystemSettings);

// Admin logs
router.get("/logs", getAdminLogs);
router.get("/logs/:id", getAdminLogDetails);
router.get("/admins", getAdminsList);

export default router;
