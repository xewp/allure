import LocalModel from "../models/LocalModel.js";
import ForeignModel from "../models/ForeignModel.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import { logAdminAction } from "../middleware/logAdminAction.js";

// Helper function to upload to Cloudinary
const uploadToCloudinary = async (base64Image) => {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'power-allure',
      resource_type: 'auto'
    });
    return result.secure_url;
  } catch (error) {
    throw new Error('Cloudinary upload failed: ' + error.message);
  }
};

// Get all local models
export const getLocalModels = async (req, res) => {
  try {
    // Only show approved models to clients by default
    // Unless showAll parameter is passed (for admin panel)
    const filter = req.query.showAll === 'true' ? {} : { approvalStatus: "approved" };
    
    // Check if filtering by availability is requested
    if (req.query.available === 'true') {
      // Show models where available is true OR undefined (for backward compatibility)
      filter.$or = [{ available: true }, { available: { $exists: false } }];
    }
    const models = await LocalModel.find(filter);
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all foreign models
export const getForeignModels = async (req, res) => {
  try {
    // Only show approved models to clients by default
    // Unless showAll parameter is passed (for admin panel)
    const filter = req.query.showAll === 'true' ? {} : { approvalStatus: "approved" };
    
    // Check if filtering by availability is requested
    if (req.query.available === 'true') {
      // Show models where available is true OR undefined (for backward compatibility)
      filter.$or = [{ available: true }, { available: { $exists: false } }];
    }
    const models = await ForeignModel.find(filter);
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single model by ID (searches both collections)
export const getModelById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format and sanitize
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: "Invalid model ID format" });
    }

    // Check for path traversal attempts
    if (id.includes('..') || id.includes('/') || id.includes('\\')) {
      return res.status(400).json({ error: "Invalid model ID" });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid model ID" });
    }

    // Try to find in LocalModel first
    let model = await LocalModel.findById(id);
    let category = "Local";
    
    // If not found, try ForeignModel
    if (!model) {
      model = await ForeignModel.findById(id);
      category = "Foreign";
    }

    if (!model) {
      return res.status(404).json({ error: "Model not found" });
    }

    // Add category to the response
    const modelWithCategory = {
      ...model.toObject(),
      category: category
    };

    res.json(modelWithCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create local model with Cloudinary upload
export const createLocalModel = async (req, res) => {
  try {
    const { imageUrl, galleryImages, ...otherData } = req.body;
    
    // Upload main image to Cloudinary
    const uploadedImageUrl = await uploadToCloudinary(imageUrl);
    
    // Upload gallery images if present
    let uploadedGalleryUrls = [];
    if (galleryImages && galleryImages.length > 0) {
      const uploadPromises = galleryImages.map(img => uploadToCloudinary(img));
      uploadedGalleryUrls = await Promise.all(uploadPromises);
    }
    
    // Create model with uploaded URLs
    const modelData = {
      ...otherData,
      imageUrl: uploadedImageUrl,
      galleryImages: uploadedGalleryUrls
    };
    
    const model = await LocalModel.create(modelData);
    
    // Log the action
    await logAdminAction(
      req,
      "created_local_model",
      "model",
      model._id,
      model.name,
      { available: model.available }
    );
    
    res.status(201).json({ message: "Local model created!", model });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create foreign model with Cloudinary upload
export const createForeignModel = async (req, res) => {
  try {
    const { imageUrl, galleryImages, ...otherData } = req.body;
    
    // Upload main image to Cloudinary
    const uploadedImageUrl = await uploadToCloudinary(imageUrl);
    
    // Upload gallery images if present
    let uploadedGalleryUrls = [];
    if (galleryImages && galleryImages.length > 0) {
      const uploadPromises = galleryImages.map(img => uploadToCloudinary(img));
      uploadedGalleryUrls = await Promise.all(uploadPromises);
    }
    
    // Create model with uploaded URLs
    const modelData = {
      ...otherData,
      imageUrl: uploadedImageUrl,
      galleryImages: uploadedGalleryUrls
    };
    
    const model = await ForeignModel.create(modelData);
    
    // Log the action
    await logAdminAction(
      req,
      "created_foreign_model",
      "model",
      model._id,
      model.name,
      { available: model.available }
    );
    
    res.status(201).json({ message: "Foreign model created!", model });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update model by ID (searches both collections)
export const updateModel = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid model ID" });
    }

    // Try to update in LocalModel first
    let updatedModel = await LocalModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    // If not found, try ForeignModel
    if (!updatedModel) {
      updatedModel = await ForeignModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
    }

    if (!updatedModel) {
      return res.status(404).json({ error: "Model not found" });
    }
    
    // Log the action
    await logAdminAction(
      req,
      "updated_model",
      "model",
      updatedModel._id,
      updatedModel.name,
      { updatedFields: Object.keys(updateData) }
    );

    res.json({ message: "Model updated successfully", model: updatedModel });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete model by ID (searches both collections)
export const deleteModel = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid model ID" });
    }

    // Try to delete from LocalModel first
    let deletedModel = await LocalModel.findByIdAndDelete(id);
    
    // If not found, try ForeignModel
    if (!deletedModel) {
      deletedModel = await ForeignModel.findByIdAndDelete(id);
    }

    if (!deletedModel) {
      return res.status(404).json({ error: "Model not found" });
    }
    
    // Log the action
    await logAdminAction(
      req,
      "deleted_model",
      "model",
      deletedModel._id,
      deletedModel.name
    );

    res.json({ message: "Model deleted successfully", model: deletedModel });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get users who liked a specific model
export const getModelLikes = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Import User model dynamically to avoid circular dependencies if any
    const User = (await import("../models/User.js")).default;

    // Find users who have this model in their favorites
    // We only need specific fields from the user
    const users = await User.find(
      { "favorites.modelId": id },
      "username email firstName lastName favorites"
    );

    // Map to a cleaner format, extracting the specific favorite entry timestamp if needed
    const likedBy = users.map(user => {
      const favoriteEntry = user.favorites.find(f => f.modelId === id);
      return {
        _id: user._id, 
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        likedAt: favoriteEntry ? favoriteEntry.addedAt : null
      };
    });

    res.json({
      success: true,
      count: likedBy.length,
      users: likedBy
    });
  } catch (error) {
    console.error("Error fetching model likes:", error);
    res.status(500).json({ error: "Failed to fetch model likes" });
  }
};

