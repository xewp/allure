import express from 'express';
import SystemSettings from '../models/SystemSettings.js';

const router = express.Router();

/**
 * Get public system settings (no authentication required)
 * Returns only publicly accessible settings like signup status
 */
router.get('/public-settings', async (req, res) => {
  try {
    const enableSignup = await SystemSettings.findOne({ key: 'enableSignup' });
    
    res.json({
      success: true,
      settings: {
        signupEnabled: enableSignup ? enableSignup.value : true, // Default to true if not set
      },
    });
  } catch (error) {
    console.error('Error fetching public settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
    });
  }
});

export default router;
