import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import API_URL from "../../config/api";

const EditProfileModal = ({ isOpen, onClose, userData, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);
  const [apiError, setApiError] = useState("");
  const [passwordApiError, setPasswordApiError] = useState("");

  // Initialize form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
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
    setPasswordErrors({});
    setApiError("");
    setPasswordApiError("");
    setShowSuccess(false);
    setShowPasswordSuccess(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setPasswordApiError("");
  };

  const validateProfileForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!validateProfileForm()) {
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

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      setApiError(
        error.message || "Failed to update profile. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setLoading(true);
    setPasswordApiError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/users/${userData._id}/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      // Show success message
      setShowPasswordSuccess(true);

      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowPasswordSuccess(false);
      }, 3000);
    } catch (error) {
      setPasswordApiError(
        error.message || "Failed to change password. Please try again.",
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
        className="relative w-full max-w-3xl bg-gradient-to-br from-charcoal via-gray-900 to-black rounded-3xl border border-gold/30 shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto"
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
        <div className="relative z-10 px-8 py-6">
          {/* Profile Information Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gold mb-4">
              Profile Information
            </h3>

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

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <p className="mt-1 text-sm text-red-400">
                      {errors.firstName}
                    </p>
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
                    <p className="mt-1 text-sm text-red-400">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Disabled Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email - Disabled */}
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Email Address{" "}
                    <span className="text-xs">(Cannot be changed)</span>
                  </label>
                  <input
                    type="email"
                    value={userData?.email || ""}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-black/20 border border-gray-600/30 text-gray-500 cursor-not-allowed"
                  />
                </div>

                {/* Phone Number - Disabled */}
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Phone Number{" "}
                    <span className="text-xs">(Cannot be changed)</span>
                  </label>
                  <input
                    type="text"
                    value={userData?.phoneNumber || ""}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-black/20 border border-gray-600/30 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Age - Disabled */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Age <span className="text-xs">(Cannot be changed)</span>
                </label>
                <input
                  type="number"
                  value={userData?.age || ""}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-black/20 border border-gray-600/30 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Profile Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-gold-light via-gold to-gold-dark text-black font-semibold rounded-xl hover:shadow-gold-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Update Profile"}
              </button>
            </form>
          </div>

          {/* Divider */}
          <div className="border-t border-gold/20 my-8"></div>

          {/* Password Change Section */}
          <div>
            <h3 className="text-xl font-semibold text-gold mb-4">
              Change Password
            </h3>

            {/* Password Success Message */}
            {showPasswordSuccess && (
              <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-center animate-fade-in">
                ✓ Password changed successfully!
              </div>
            )}

            {/* Password Error Message */}
            {passwordApiError && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-center animate-fade-in">
                {passwordApiError}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Current Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 py-3 rounded-xl bg-black/40 border ${
                    passwordErrors.currentPassword
                      ? "border-red-500"
                      : "border-gold/30"
                  } focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 text-white placeholder-gray-500 transition-all duration-300`}
                  placeholder="Enter current password"
                />
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-400">
                    {passwordErrors.currentPassword}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    New Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-3 rounded-xl bg-black/40 border ${
                      passwordErrors.newPassword
                        ? "border-red-500"
                        : "border-gold/30"
                    } focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 text-white placeholder-gray-500 transition-all duration-300`}
                    placeholder="Enter new password"
                  />
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-400">
                      {passwordErrors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Confirm New Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-3 rounded-xl bg-black/40 border ${
                      passwordErrors.confirmPassword
                        ? "border-red-500"
                        : "border-gold/30"
                    } focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 text-white placeholder-gray-500 transition-all duration-300`}
                    placeholder="Confirm new password"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-400">
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-gold-light via-gold to-gold-dark text-black font-semibold rounded-xl hover:shadow-gold-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>

          {/* Close Button */}
          <div className="mt-8 pt-6 border-t border-gold/20">
            <button
              type="button"
              onClick={handleClose}
              className="w-full px-6 py-3 border-2 border-gray-500/30 text-gray-300 font-semibold rounded-xl hover:bg-gray-500/10 hover:border-gray-400/50 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default EditProfileModal;
