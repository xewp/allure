import User from '../models/User.js';
import LocalModel from '../models/LocalModel.js';
import ForeignModel from '../models/ForeignModel.js';
import { logAdminAction } from '../middleware/logAdminAction.js';

export const addFavorite = async (req, res) => {
    try {
        const { userId, modelId, name, username, password, imageUrl, category } = req.body;
        
        // First check if it's already in favorites
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const alreadyFavorited = user.favorites.some(fav => String(fav.modelId) === String(modelId));
        
        if (alreadyFavorited) {
            // Already favorited, just return the current user
            const currentUser = await User.findById(userId).select('-password');
            return res.status(200).json(currentUser);
        }
        
        const favoriteObject = {
            modelId,
            name,
            username,
            password,
            imageUrl,
            category
        };
        
        // Add to user's favorites
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { $addToSet: { favorites: favoriteObject } },
            { new: true }
        ).select('-password');
        
        // Increment favoritesCount on the model (try both collections)
        await LocalModel.findByIdAndUpdate(
            modelId,
            { $inc: { favoritesCount: 1 } }
        ).catch(() => {});
        
        await ForeignModel.findByIdAndUpdate(
            modelId,
            { $inc: { favoritesCount: 1 } }
        ).catch(() => {});
        
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeFavorite = async (req, res) => {
    try {
        const { userId, modelId } = req.body;
        
        // Remove from user's favorites
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { $pull: { favorites: { modelId: modelId } } },
            { new: true }
        ).select('-password');
        
        // Decrement favoritesCount on the model (try both collections)
        await LocalModel.findByIdAndUpdate(
            modelId,
            { $inc: { favoritesCount: -1 } }
        ).catch(() => {});
        
        await ForeignModel.findByIdAndUpdate(
            modelId,
            { $inc: { favoritesCount: -1 } }
        ).catch(() => {});
        
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getFavorites = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch actual model data for each favorite
        const favoritesWithData = await Promise.all(
            user.favorites.map(async (fav) => {
                try {
                    // Try to find in LocalModel first, then ForeignModel
                    let model = await LocalModel.findById(fav.modelId);
                    let category = fav.category || 'Local';
                    
                    if (!model) {
                        model = await ForeignModel.findById(fav.modelId);
                        category = fav.category || 'Foreign';
                    }

                    // If model found, use its current data
                    if (model) {
                        return {
                            _id: model._id,
                            modelId: model._id,
                            name: model.name,
                            imageUrl: model.imageUrl,
                            category: category
                        };
                    }

                    // If model not found, return null (will be filtered out)
                    return null;
                } catch (error) {
                    console.error(`Error fetching model ${fav.modelId}:`, error);
                    return null;
                }
            })
        );

        // Filter out null values (models that weren't found)
        const validFavorites = favoritesWithData.filter(fav => fav !== null);

        res.status(200).json(validFavorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user by ID - for profile page
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
};

// Get all users (excluding passwords) - for admin panel
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    // Log the action
    await logAdminAction(
      req,
      "deleted_user",
      "user",
      deletedUser._id,
      `${deletedUser.firstName} ${deletedUser.lastName} (${deletedUser.email})`
    );
    
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting user",
    });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phoneNumber, age } = req.body;
    
    // Build update object with only provided fields
    const updateData = {};
    if (firstName) updateData.firstName = firstName.trim();
    if (lastName) updateData.lastName = lastName.trim();
    if (email) {
      // Validate email format
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid email address",
        });
      }
      
      // Check if email is already taken by another user
      const existingEmail = await User.findOne({ 
        email: email.toLowerCase(), 
        _id: { $ne: id } 
      });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
      
      updateData.email = email.toLowerCase().trim();
    }
    if (phoneNumber) updateData.phoneNumber = phoneNumber.trim();
    if (age) {
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
        return res.status(400).json({
          success: false,
          message: "Age must be between 18 and 120",
        });
      }
      updateData.age = ageNum;
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    // Log the action
    await logAdminAction(
      req,
      "updated_user",
      "user",
      updatedUser._id,
      `${updatedUser.firstName} ${updatedUser.lastName} (${updatedUser.email})`,
      { updatedFields: Object.keys(updateData) }
    );
    
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Server error while updating user",
    });
  }
};
