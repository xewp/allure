import React, { useCallback, useState, useEffect } from "react";
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

  const handleClose = useCallback(() => {
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
  }, [onClose]);

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
  }, [handleClose, isOpen]);

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
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");
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

      // Update sessionStorage & localStorage with new user data
      const updatedUser = { ...userData, ...data.user };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
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
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/85 p-3 sm:p-5"
      onClick={handleClose}
    >
      <div
        className="relative max-h-[94vh] w-full max-w-3xl overflow-y-auto border border-porcelain/10 bg-porcelain text-obsidian shadow-editorial"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
      >
        <div className="sticky top-0 z-20 border-b border-obsidian/10 bg-porcelain px-5 py-5 sm:px-8 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-oxblood">Account settings</p>
              <h2 id="edit-profile-title" className="font-serif text-3xl text-obsidian sm:text-4xl">
              Edit Profile
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="flex h-11 w-11 items-center justify-center text-3xl leading-none text-warm-gray transition hover:text-oxblood focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>

        <div className="relative z-10 px-5 py-7 sm:px-8 sm:py-9">
          <section className="mb-9" aria-labelledby="profile-information-title">
            <h3 id="profile-information-title" className="mb-1 font-serif text-2xl text-obsidian">
              Profile Information
            </h3>
            <p className="mb-6 text-sm leading-6 text-warm-gray">Update the name shown across your VELORA account.</p>

            {/* Success Message */}
            {showSuccess && (
              <div className="mb-5 rounded-lg border border-success/30 bg-success/10 p-4 text-sm font-medium text-success" role="status">
                ✓ Profile updated successfully!
              </div>
            )}

            {/* Error Message */}
            {apiError && (
              <div className="mb-5 rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm font-medium text-danger" role="alert">
                {apiError}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* First Name */}
                <div>
                  <label htmlFor="profile-first-name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-warm-gray">
                    First Name <span className="text-danger">*</span>
                  </label>
                  <input
                    id="profile-first-name"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    autoComplete="given-name"
                    aria-invalid={Boolean(errors.firstName)}
                    aria-describedby={errors.firstName ? "profile-first-name-error" : undefined}
                    className={`w-full rounded-lg border bg-white px-4 py-3.5 text-sm text-obsidian outline-none transition placeholder:text-taupe focus:ring-2 focus:ring-oxblood/15 ${
                      errors.firstName ? "border-danger focus:border-danger" : "border-obsidian/20 focus:border-oxblood"
                    }`}
                    placeholder="First name"
                  />
                  {errors.firstName && (
                    <p id="profile-first-name-error" className="mt-1.5 text-xs text-danger">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="profile-last-name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-warm-gray">
                    Last Name <span className="text-danger">*</span>
                  </label>
                  <input
                    id="profile-last-name"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    autoComplete="family-name"
                    aria-invalid={Boolean(errors.lastName)}
                    aria-describedby={errors.lastName ? "profile-last-name-error" : undefined}
                    className={`w-full rounded-lg border bg-white px-4 py-3.5 text-sm text-obsidian outline-none transition placeholder:text-taupe focus:ring-2 focus:ring-oxblood/15 ${
                      errors.lastName ? "border-danger focus:border-danger" : "border-obsidian/20 focus:border-oxblood"
                    }`}
                    placeholder="Last name"
                  />
                  {errors.lastName && (
                    <p id="profile-last-name-error" className="mt-1.5 text-xs text-danger">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Disabled Fields */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Email - Disabled */}
                <div>
                  <label htmlFor="profile-email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-taupe">
                    Email Address{" "}
                    <span className="text-xs">(Cannot be changed)</span>
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    value={userData?.email || ""}
                    disabled
                    className="w-full cursor-not-allowed rounded-lg border border-obsidian/10 bg-obsidian/5 px-4 py-3.5 text-sm text-warm-gray"
                  />
                </div>

                {/* Phone Number - Disabled */}
                <div>
                  <label htmlFor="profile-phone" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-taupe">
                    Phone Number{" "}
                    <span className="text-xs">(Cannot be changed)</span>
                  </label>
                  <input
                    id="profile-phone"
                    type="text"
                    value={userData?.phoneNumber || ""}
                    disabled
                    className="w-full cursor-not-allowed rounded-lg border border-obsidian/10 bg-obsidian/5 px-4 py-3.5 text-sm text-warm-gray"
                  />
                </div>
              </div>

              {/* Age - Disabled */}
              <div>
                <label htmlFor="profile-age" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-taupe">
                  Age <span className="text-xs">(Cannot be changed)</span>
                </label>
                <input
                  id="profile-age"
                  type="number"
                  value={userData?.age || ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-obsidian/10 bg-obsidian/5 px-4 py-3.5 text-sm text-warm-gray"
                />
              </div>

              {/* Profile Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-oxblood px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-oxblood-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Saving..." : "Update Profile"}
              </button>
            </form>
          </section>

          <div className="my-9 border-t border-obsidian/10" />

          <section aria-labelledby="change-password-title">
            <h3 id="change-password-title" className="mb-1 font-serif text-2xl text-obsidian">
              Change Password
            </h3>
            <p className="mb-6 text-sm leading-6 text-warm-gray">Use a unique password with at least six characters.</p>

            {/* Password Success Message */}
            {showPasswordSuccess && (
              <div className="mb-5 rounded-lg border border-success/30 bg-success/10 p-4 text-sm font-medium text-success" role="status">
                ✓ Password changed successfully!
              </div>
            )}

            {/* Password Error Message */}
            {passwordApiError && (
              <div className="mb-5 rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm font-medium text-danger" role="alert">
                {passwordApiError}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              {/* Current Password */}
              <div>
                <label htmlFor="current-password" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-warm-gray">
                  Current Password <span className="text-danger">*</span>
                </label>
                <input
                  id="current-password"
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                  aria-invalid={Boolean(passwordErrors.currentPassword)}
                  aria-describedby={passwordErrors.currentPassword ? "current-password-error" : undefined}
                  className={`w-full rounded-lg border bg-white px-4 py-3.5 text-sm text-obsidian outline-none transition placeholder:text-taupe focus:ring-2 focus:ring-oxblood/15 ${
                    passwordErrors.currentPassword
                      ? "border-danger focus:border-danger"
                      : "border-obsidian/20 focus:border-oxblood"
                  }`}
                  placeholder="Enter current password"
                />
                {passwordErrors.currentPassword && (
                  <p id="current-password-error" className="mt-1.5 text-xs text-danger">
                    {passwordErrors.currentPassword}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* New Password */}
                <div>
                  <label htmlFor="new-profile-password" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-warm-gray">
                    New Password <span className="text-danger">*</span>
                  </label>
                  <input
                    id="new-profile-password"
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    autoComplete="new-password"
                    aria-invalid={Boolean(passwordErrors.newPassword)}
                    aria-describedby={passwordErrors.newPassword ? "new-profile-password-error" : undefined}
                    className={`w-full rounded-lg border bg-white px-4 py-3.5 text-sm text-obsidian outline-none transition placeholder:text-taupe focus:ring-2 focus:ring-oxblood/15 ${
                      passwordErrors.newPassword
                        ? "border-danger focus:border-danger"
                        : "border-obsidian/20 focus:border-oxblood"
                    }`}
                    placeholder="Enter new password"
                  />
                  {passwordErrors.newPassword && (
                    <p id="new-profile-password-error" className="mt-1.5 text-xs text-danger">
                      {passwordErrors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirm-profile-password" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-warm-gray">
                    Confirm New Password <span className="text-danger">*</span>
                  </label>
                  <input
                    id="confirm-profile-password"
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    autoComplete="new-password"
                    aria-invalid={Boolean(passwordErrors.confirmPassword)}
                    aria-describedby={passwordErrors.confirmPassword ? "confirm-profile-password-error" : undefined}
                    className={`w-full rounded-lg border bg-white px-4 py-3.5 text-sm text-obsidian outline-none transition placeholder:text-taupe focus:ring-2 focus:ring-oxblood/15 ${
                      passwordErrors.confirmPassword
                        ? "border-danger focus:border-danger"
                        : "border-obsidian/20 focus:border-oxblood"
                    }`}
                    placeholder="Confirm new password"
                  />
                  {passwordErrors.confirmPassword && (
                    <p id="confirm-profile-password-error" className="mt-1.5 text-xs text-danger">
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-obsidian px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </form>
          </section>

          {/* Close Button */}
          <div className="mt-9 border-t border-obsidian/10 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="w-full rounded-lg border border-obsidian/20 px-6 py-3 text-sm font-semibold text-obsidian transition hover:border-oxblood hover:text-oxblood focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood"
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
