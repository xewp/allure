import User from '../models/User.js';
import { sendApprovalEmail } from '../services/emailService.js';
import AdminLog from '../models/AdminLog.js';
import { log } from '../utils/logger.js';

/**
 * Get all pending users awaiting approval
 * Superadmin only
 */
export const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({
      emailVerified: true,
      approvalStatus: 'pending',
    })
      .select('-password -otpHash -activeSessionToken')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
message: `Found ${pendingUsers.length} pending users`,
      data: pendingUsers,
    });
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending users',
    });
  }
};

/**
 * Approve a user account
 * Superadmin only
 */
export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'User email must be verified before approval',
      });
    }

    if (user.approvalStatus === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'User is already approved',
      });
    }

    // Approve user
    user.isApproved = true;
    user.approvalStatus = 'approved';
    await user.save();

    // Send approval notification email
    let emailSent = false;
    let emailError = null;
    
    try {
      await sendApprovalEmail(user.email, true);
      emailSent = true;
      log.info('Approval email sent successfully', { email: user.email, userId: user._id });
    } catch (emailErr) {
      emailError = emailErr.message;
      log.error('Failed to send approval email', { 
        email: user.email, 
        userId: user._id,
        error: emailErr.message,
        stack: emailErr.stack 
      });
      // Continue even if email fails - user is still approved
    }

    // Log admin action
    try {
      await AdminLog.create({
        adminId: req.user.userId || req.user.id,
        adminName: req.user.username || 'Superadmin',
        action: 'USER_APPROVED',
        targetType: 'user',
        targetId: user._id,
        targetName: user.username,
        details: {
          email: user.email,
          approvedAt: new Date(),
        },
      });
    } catch (logError) {
      console.error('Failed to create admin log:', logError);
    }

    res.status(200).json({
      success: true,
      message: 'User approved successfully',
      emailSent,
      emailError: emailError || undefined,
      data: {
        id: user._id,
        email: user.email,
        approvalStatus: user.approvalStatus,
      },
    });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve user',
    });
  }
};

/**
 * Reject a user account
 * Superadmin only
 */
export const rejectUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.approvalStatus === 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'User is already rejected',
      });
    }

    // Reject user
    user.isApproved = false;
    user.approvalStatus = 'rejected';
    await user.save();

    // Send rejection notification email
    let emailSent = false;
    let emailError = null;
    
    try {
      await sendApprovalEmail(user.email, false);
      emailSent = true;
      log.info('Rejection email sent successfully', { email: user.email, userId: user._id });
    } catch (emailErr) {
      emailError = emailErr.message;
      log.error('Failed to send rejection email', { 
        email: user.email, 
        userId: user._id,
        error: emailErr.message,
        stack: emailErr.stack 
      });
      // Continue even if email fails - user is still rejected
    }

    // Log admin action
    try {
      await AdminLog.create({
        adminId: req.user.userId || req.user.id,
        adminName: req.user.username || 'Superadmin',
        action: 'USER_REJECTED',
        targetType: 'user',
        targetId: user._id,
        targetName: user.username,
        details: {
          email: user.email,
          rejectedAt: new Date(),
        },
      });
    } catch (logError) {
      console.error('Failed to create admin log:', logError);
    }

    res.status(200).json({
      success: true,
      message: 'User rejected',
      emailSent,
      emailError: emailError || undefined,
      data: {
        id: user._id,
        email: user.email,
        approvalStatus: user.approvalStatus,
      },
    });
  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject user',
    });
  }
};

/**
 * Get all users by approval status
 * Superadmin only
 */
export const getUsersByStatus = async (req, res) => {
  try {
    const { status } = req.query; // 'pending', 'approved', 'rejected'

    const filter = {};
    if (status) {
      filter.approvalStatus = status;
    }

    const users = await User.find(filter)
      .select('-password -otpHash -activeSessionToken')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: `Found ${users.length} users`,
      data: users,
    });
  } catch (error) {
    console.error('Get users by status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
};
