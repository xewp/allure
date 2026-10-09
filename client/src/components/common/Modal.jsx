import React, { useEffect } from "react";

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
 * @param {string} props.actionText - Optional action button text
 * @param {function} props.onAction - Optional action button callback
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  confirmText = "OK",
  onConfirm,
  actionText,
  onAction,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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
        return { icon: "✓", accent: "border-success/40 bg-success/15 text-emerald-200" };
      case "error":
        return { icon: "✕", accent: "border-danger/40 bg-danger/15 text-red-200" };
      case "warning":
        return { icon: "!", accent: "border-brass/40 bg-brass/10 text-brass-light" };
      default:
        return { icon: "i", accent: "border-porcelain/20 bg-porcelain/5 text-porcelain" };
    }
  };

  const config = getTypeConfig();

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-obsidian/90 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-modal-title"
        className="w-full max-w-md rounded-t-2xl border border-porcelain/15 bg-ink p-6 text-porcelain shadow-editorial sm:rounded-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`mb-5 flex h-12 w-12 items-center justify-center rounded-full border font-serif text-xl ${config.accent}`}
          aria-hidden="true"
        >
          {config.icon}
        </div>

        <h3 id="app-modal-title" className="font-serif text-3xl leading-tight">
          {title}
        </h3>

        <p className="mb-7 mt-3 text-sm leading-6 text-taupe">{message}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          {actionText && onAction && (
            <button
              onClick={() => {
                onAction();
                onClose();
              }}
              className="rounded-xl border border-porcelain/20 px-5 py-3 text-sm font-semibold transition hover:bg-porcelain/5"
            >
              {actionText}
            </button>
          )}

          <button
            onClick={handleConfirm}
            className={`${actionText && onAction ? "" : "sm:col-span-2"} rounded-xl bg-oxblood px-5 py-3 text-sm font-semibold text-porcelain transition hover:bg-oxblood-light`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
