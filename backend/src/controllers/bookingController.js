import Booking from "../models/Booking.js";
import { logAdminAction } from "../middleware/logAdminAction.js";

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

    await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: newBooking,
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
    const userId = req.params.userId || req.user.id;

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
    await booking.save();
    
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
      booking,
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
