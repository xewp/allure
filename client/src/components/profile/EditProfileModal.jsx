import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import API_URL from "../../config/api";

const EditProfileModal = ({ isOpen, onClose, userData, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    age: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  // Initialize form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
        age: userData.age || "",
      });
    }
  }, [userData]);

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

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please provide a valid email address";
      }
    }

    // Phone Number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }

    // Age validation
    if (!formData.age) {
      newErrors.age = "Age is required";
    } else {
      const ageNum = parseInt(formData.age);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
        newErrors.age = "Age must be between 18 and 120";
      }
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
      const response = await fetch(`${API_URL}/api/users/${userData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update localStorage with new user data
      const updatedUser = { ...userData, ...data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Show success message
      setShowSuccess(true);

      // Notify parent component
      onUpdateSuccess(updatedUser);

      // Close modal after short delay
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      setApiError(
        error.message || "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
              Edit Profile
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
          {/* Success Message */}
          {showSuccess && (
            <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-center animate-fade-in">
              ✓ Profile updated successfully!
            </div>
          )}

          {/* Error Message */}
          {apiError && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-center animate-fade-in">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                First Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl bg-black/40 border ${
                  errors.firstName ? "border-red-500" : "border-gold/30"
                } focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 text-white placeholder-gray-500 transition-all duration-300`}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Last Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl bg-black/40 border ${
                  errors.lastName ? "border-red-500" : "border-gold/30"
                } focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 text-white placeholder-gray-500 transition-all duration-300`}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl bg-black/40 border ${
                  errors.email ? "border-red-500" : "border-gold/30"
                } focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 text-white placeholder-gray-500 transition-all duration-300`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl bg-black/40 border ${
                  errors.phoneNumber ? "border-red-500" : "border-gold/30"
                } focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 text-white placeholder-gray-500 transition-all duration-300`}
                placeholder="Enter your phone number"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Age <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                min="18"
                max="120"
                className={`w-full px-4 py-3 rounded-xl bg-black/40 border ${
                  errors.age ? "border-red-500" : "border-gold/30"
                } focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 text-white placeholder-gray-500 transition-all duration-300`}
                placeholder="Enter your age"
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-400">{errors.age}</p>
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
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default EditProfileModal;
