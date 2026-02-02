import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { logAdminAction } from "../middleware/logAdminAction.js";
import { sendBookingSubmittedEmail, sendBookingConfirmedEmail, sendBookingCancelledEmail } from "../services/emailService.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const {
      userName,
      company,
      event,
      eventDate,
      eventTime,
      modelId,
      modelName,
      modelCategory,
    } = req.body;

    // Validate required fields (company is now optional)
    if (
      !userName ||
      !event ||
      !eventDate ||
      !eventTime ||
      !modelId ||
      !modelName ||
      !modelCategory
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Get userId from authenticated user - support both old (id) and new (userId) JWT format
    const userId = req.user.userId || req.user.id;

    // Create new booking
    const newBooking = new Booking({
      userId,
      userName,
      company,
      event,
      eventDate,
      eventTime,
      modelId,
      modelName,
      modelCategory,
      status: "pending",
    });

    const savedBooking = await newBooking.save();

    // Send confirmation email to client
    try {
      const user = await User.findById(userId).select('email');
      if (user) {
        await sendBookingSubmittedEmail(user.email, {
          userName,
          modelName,
          event,
          eventDate,
          eventTime,
          company,
          status: 'pending'
        });
      }
    } catch (emailError) {
      // Non-blocking - log but don't fail booking
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: savedBooking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating booking",
    });
  }
};

// Get all bookings (admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "-password") // Populate all user fields except password
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get all bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching bookings",
    });
  }
};

// Get bookings for a specific user
export const getUserBookings = async (req, res) => {
  try {
    // Support both route param (admin) and decoded token (user)
    let userId = req.params.userId || req.user?.userId || req.user?.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID not found",
      });
    }

    // Convert string to ObjectId if needed
    const mongoose = await import('mongoose');
    if (typeof userId === 'string') {
      userId = new mongoose.default.Types.ObjectId(userId);
    }

    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get user bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user bookings",
    });
  }
};

// Get a single booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id).populate(
      "userId",
      "username email"
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching booking",
    });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = status;
    booking.updatedAt = Date.now();
    const updatedBooking = await booking.save();

    // Send email notification
    try {
      const user = await User.findById(booking.userId).select('email');
      if (user) {
        const emailData = {
          userName: booking.userName,
          modelName: booking.modelName,
          event: booking.event,
          eventDate: booking.eventDate,
          eventTime: booking.eventTime,
          company: booking.company
        };
        if (status === 'confirmed') {
          await sendBookingConfirmedEmail(user.email, emailData);
        } else if (status === 'cancelled') {
          await sendBookingCancelledEmail(user.email, emailData);
        }
      }
    } catch (emailError) {
      // Non-blocking
    }
    
    // Log the action
    await logAdminAction(
      req,
      "updated_booking_status",
      "booking",
      booking._id,
      `${booking.userName} - ${booking.modelName}`,
      { previousStatus: booking.status, newStatus: status }
    );

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating booking status",
    });
  }
};

// Delete a booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    
    // Log the action
    await logAdminAction(
      req,
      "deleted_booking",
      "booking",
      booking._id,
      `${booking.userName} - ${booking.modelName}`
    );

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("Delete booking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting booking",
    });
  }
};
