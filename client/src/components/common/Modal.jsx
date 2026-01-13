import React from "react";

/**
 * Modal Component - Reusable modal for displaying messages
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Callback when modal is closed
 * @param {string} props.title - Modal title
 * @param {string} props.message - Modal message
 * @param {string} props.type - Modal type: 'success', 'error', 'warning', 'info'
 * @param {string} props.confirmText - Text for confirm button (default: 'OK')
 * @param {function} props.onConfirm - Callback when confirm is clicked
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  confirmText = "OK",
  onConfirm,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  // Icon and color based on type
  const getTypeConfig = () => {
    switch (type) {
      case "success":
        return { icon: "✓", color: "#10b981", bgColor: "#d1fae5" };
      case "error":
        return { icon: "✕", color: "#ef4444", bgColor: "#fee2e2" };
      case "warning":
        return { icon: "⚠", color: "#f59e0b", bgColor: "#fef3c7" };
      default:
        return { icon: "ℹ", color: "#3b82f6", bgColor: "#dbeafe" };
    }
  };

  const config = getTypeConfig();

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold"
          style={{ backgroundColor: config.bgColor, color: config.color }}
        >
          {config.icon}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-center text-gray-600 mb-6">{message}</p>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
          style={{ backgroundColor: config.color }}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
};

export default Modal;
