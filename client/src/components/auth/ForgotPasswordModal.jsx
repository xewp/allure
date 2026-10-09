import React, { useState } from "react";
import { createPortal } from "react-dom";
import API_URL from "../../config/api";

/**
 * ForgotPasswordModal - Modal for requesting password reset
 */
const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage({ type: "error", text: "Please enter your email address" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(
        `${API_URL}/api/users/reset-password/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "If the email exists in our system, a reset link has been sent. Please check your inbox.",
        });
        setEmail("");

        // Close modal after 5 seconds
        setTimeout(() => {
          handleClose();
        }, 5000);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to send reset link",
        });
      }
    } catch {

      setMessage({
        type: "error",
        text: "Unable to connect to server. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setMessage({ type: "", text: "" });
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/85 p-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden border border-porcelain/10 bg-porcelain text-obsidian shadow-editorial"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="forgot-password-title"
      >
        <div className="relative border-b border-obsidian/10 px-6 py-6 sm:px-8">
          <div className="flex items-center justify-between">
            <h2 id="forgot-password-title" className="font-serif text-3xl text-obsidian">
              Reset your password
            </h2>
            <button
              onClick={handleClose}
              className="flex h-10 w-10 items-center justify-center text-2xl leading-none text-warm-gray transition hover:text-oxblood focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>

        <div className="px-6 py-6 sm:px-8 sm:py-8">
          {message.text && (
            <div
              className={`mb-5 rounded-lg border p-4 text-sm leading-6 ${
                message.type === "success"
                  ? "border-success/30 bg-success/10 text-success"
                  : "border-danger/30 bg-danger/10 text-danger"
              }`}
              role={message.type === "success" ? "status" : "alert"}
            >
              {message.text}
            </div>
          )}

          <p className="mb-6 text-sm leading-6 text-warm-gray">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="forgot-password-email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-warm-gray">
                Email Address
              </label>
              <input
                id="forgot-password-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full rounded-lg border border-obsidian/20 bg-white px-4 py-3.5 text-sm text-obsidian outline-none transition placeholder:text-taupe focus:border-oxblood focus:ring-2 focus:ring-oxblood/15"
                placeholder="name@example.com"
                disabled={loading}
              />
            </div>

            <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 rounded-lg border border-obsidian/20 py-3.5 text-sm font-semibold text-obsidian transition hover:border-oxblood hover:text-oxblood focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-oxblood py-3.5 text-sm font-semibold text-white transition hover:bg-oxblood-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Link"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ForgotPasswordModal;
