import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import API_URL from "../../config/api";

const BookingModal = ({ isOpen, onClose, modelData, onBookingSuccess }) => {
  const [formData, setFormData] = useState({
    company: "",
    event: "",
    eventDate: "",
    eventTime: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setFormData({
      company: "",
      event: "",
      eventDate: "",
      eventTime: "",
    });
    setErrors({});
    setApiError("");
    setShowSuccess(false);
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setApiError("");
  };

  const validateForm = () => {
    const newErrors = {};

    // Company validation
    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    }

    // Event validation
    if (!formData.event.trim()) {
      newErrors.event = "Event name is required";
    }

    // Event Date validation
    if (!formData.eventDate) {
      newErrors.eventDate = "Event date is required";
    } else {
      const selectedDate = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.eventDate = "Event date cannot be in the past";
      }
    }

    // Event Time validation
    if (!formData.eventTime) {
      newErrors.eventTime = "Event time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user") || "{}");

      if (!token || !userData._id) {
        throw new Error("Please log in to make a booking");
      }

      // Get user's full name
      const userName = `${userData.firstName || ""} ${
        userData.lastName || ""
      }`.trim();

      const bookingData = {
        userName: userName || "Guest",
        company: formData.company,
        event: formData.event,
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        modelId: modelData._id,
        modelName: modelData.name,
        modelCategory: modelData.category?.toLowerCase() || "local",
      };

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking");
      }

      // Show success message
      setShowSuccess(true);

      // Notify parent component
      if (onBookingSuccess) {
        onBookingSuccess(data.booking);
      }

      // Close modal after short delay
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      setApiError(
        error.message || "Failed to create booking. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !modelData) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-2xl bg-gradient-to-br from-charcoal via-gray-900 to-black rounded-3xl border border-gold/30 shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-gold/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-56 h-56 bg-gradient-to-tl from-gold/15 to-transparent rounded-full blur-3xl"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 px-8 py-6 border-b border-gold/20">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-3xl md:text-4xl font-bold bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
              Book {modelData.name}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gold transition-colors duration-300 text-3xl leading-none"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="relative z-10 px-8 py-6 max-h-[70vh] overflow-y-auto">
          {/* Model Info Display */}
          <div className="mb-6 p-4 bg-black/30 rounded-xl border border-gold/20">
            <p className="text-sm text-gray-400 mb-1">Booking for:</p>
            <p className="text-xl font-semibold text-gold">{modelData.name}</p>
            <p className="text-sm text-gray-300">
              {modelData.category || "Foreign"} Model
            </p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-center animate-fade-in">
              ✓ Booking request submitted successfully!
            </div>
          )}

          {/* Error Message */}
          {apiError && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-center animate-fade-in">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Company Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Company <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl bg-black/40 border ${
                  errors.company ? "border-red-500" : "border-gold/30"
                } focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 text-white placeholder-gray-500 transition-all duration-300`}
                placeholder="Your company name"
              />
              {errors.company && (
                <p className="mt-1 text-sm text-red-400">{errors.company}</p>
              )}
            </div>

            {/* Event Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Event <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="event"
                value={formData.event}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl bg-black/40 border ${
                  errors.event ? "border-red-500" : "border-gold/30"
                } focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 text-white placeholder-gray-500 transition-all duration-300`}
                placeholder="Event name or type"
              />
              {errors.event && (
                <p className="mt-1 text-sm text-red-400">{errors.event}</p>
              )}
            </div>

            {/* Event Date Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Event Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                className={`w-full px-4 py-3 rounded-xl bg-black/40 border ${
                  errors.eventDate ? "border-red-500" : "border-gold/30"
                } focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 text-white transition-all duration-300`}
              />
              {errors.eventDate && (
                <p className="mt-1 text-sm text-red-400">{errors.eventDate}</p>
              )}
            </div>

            {/* Event Time Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Event Time <span className="text-red-400">*</span>
              </label>
              <input
                type="time"
                name="eventTime"
                value={formData.eventTime}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl bg-black/40 border ${
                  errors.eventTime ? "border-red-500" : "border-gold/30"
                } focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 text-white transition-all duration-300`}
              />
              {errors.eventTime && (
                <p className="mt-1 text-sm text-red-400">{errors.eventTime}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 border-2 border-gray-500/30 text-gray-300 font-semibold rounded-xl hover:bg-gray-500/10 hover:border-gray-400/50 transition-all duration-300"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-gold-light via-gold to-gold-dark text-black font-semibold rounded-xl hover:shadow-gold-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default BookingModal;
