import express from 'express';
import { getPendingUsers, approveUser, rejectUser, getUsersByStatus } from '../controllers/userApprovalController.js';
import { toggleModelAccess } from '../controllers/modelAccessController.js';
import { adminLimiter } from '../middleware/rateLimiter.js';
import { authenticateAdmin } from '../middleware/adminAuthMiddleware.js';
import { requireSuperadmin } from '../middleware/requireSuperadmin.js';

const router = express.Router();

// All routes require superadmin authentication
router.use(authenticateAdmin);
router.use(requireSuperadmin);
router.use(adminLimiter);

/**
 * @route   GET /api/admin/pending-users
 * @desc    Get all users awaiting approval
 * @access  Superadmin only
 */
router.get('/pending-users', getPendingUsers);

/**
 * @route   GET /api/admin/users
 * @desc    Get users by approval status
 * @query   status (pending|approved|rejected)
 * @access  Superadmin only
 */
router.get('/users', getUsersByStatus);

/**
 * @route   PATCH /api/admin/approve-user/:id
 * @desc    Approve a user account
 * @access  Superadmin only
 */
router.patch('/approve-user/:id', approveUser);

/**
 * @route   PATCH /api/admin/reject-user/:id
 * @desc    Reject a user account
 * @access  Superadmin only
 */
router.patch('/reject-user/:id', rejectUser);

/**
 * @route   PATCH /api/admin/toggle-model-access/:id
 * @desc    Toggle user's ability to view models
 * @access  Superadmin only
 */
router.patch('/toggle-model-access/:id', toggleModelAccess);

export default router;
