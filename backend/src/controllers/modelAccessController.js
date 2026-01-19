import User from '../models/User.js';
import AdminLog from '../models/AdminLog.js';

/**
 * Toggle user's ability to view models
 * Superadmin only
 */
export const toggleModelAccess = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Toggle the canViewModels field
    user.canViewModels = !user.canViewModels;
    await user.save();

    // Log admin action
    try {
      await AdminLog.create({
        adminId: req.user.userId || req.user.id,
        adminName: req.user.username || 'Superadmin',
        action: user.canViewModels ? 'MODEL_ACCESS_ENABLED' : 'MODEL_ACCESS_DISABLED',
        targetType: 'user',
        targetId: user._id,
        targetName: user.username,
        details: {
          email: user.email,
          canViewModels: user.canViewModels,
          changedAt: new Date(),
        },
      });
    } catch (logError) {
      console.error('Failed to create admin log:', logError);
    }

    res.status(200).json({
      success: true,
      message: `Model access ${user.canViewModels ? 'enabled' : 'disabled'} for user`,
      data: {
        id: user._id,
        email: user.email,
        canViewModels: user.canViewModels,
      },
    });
  } catch (error) {
    console.error('Toggle model access error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle model access',
    });
  }
};
