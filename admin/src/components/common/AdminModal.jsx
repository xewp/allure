import React from "react";

/**
 * AdminModal Component - Reusable modal for admin panel
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Callback when modal is closed
 * @param {string} props.title - Modal title
 * @param {string} props.message - Modal message
 * @param {string} props.type - Modal type: 'success', 'error', 'warning', 'info'
 * @param {string} props.confirmText - Text for confirm button (default: 'OK')
 * @param {function} props.onConfirm - Callback when confirm is clicked
 * @param {boolean} props.showCancel - Whether to show cancel button
 * @param {function} props.onCancel - Callback when cancel is clicked
 */
const AdminModal = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  confirmText = "OK",
  onConfirm,
  showCancel = false,
  onCancel,
}) => {
  const themeColor = "#d6b48e";

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  // Icon and color based on type
  const getTypeConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: "✓",
          color: "#10b981",
          bgColor: "rgba(16, 185, 129, 0.1)",
        };
      case "error":
        return {
          icon: "✕",
          color: "#ef4444",
          bgColor: "rgba(239, 68, 68, 0.1)",
        };
      case "warning":
        return {
          icon: "⚠",
          color: "#f59e0b",
          bgColor: "rgba(245, 158, 11, 0.1)",
        };
      default:
        return {
          icon: "ℹ",
          color: themeColor,
          bgColor: "rgba(214, 180, 142, 0.1)",
        };
    }
  };

  const config = getTypeConfig();

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border-2 animate-fade-in"
        style={{ borderColor: themeColor }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold"
          style={{ backgroundColor: config.bgColor, color: config.color }}
        >
          {config.icon}
        </div>

        {/* Title */}
        <h3
          className="text-2xl font-bold text-center mb-3"
          style={{ color: themeColor }}
        >
          {title}
        </h3>

        {/* Message */}
        <p className="text-center text-gray-300 mb-8 text-lg">{message}</p>

        {/* Buttons */}
        <div className={`flex gap-3 ${showCancel ? "" : "justify-center"}`}>
          {showCancel && (
            <button
              onClick={handleCancel}
              className="flex-1 py-3 rounded-xl border-2 text-white font-semibold transition-all hover:bg-gray-800"
              style={{ borderColor: themeColor }}
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`${
              showCancel ? "flex-1" : "px-12"
            } py-3 rounded-xl font-semibold text-black transition-all hover:scale-105`}
            style={{ backgroundColor: config.color }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
