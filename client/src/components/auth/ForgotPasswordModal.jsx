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

        // Close modal after 3 seconds
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to send reset link",
        });
      }
    } catch (error) {
      console.error("Password reset request error:", error);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md bg-gradient-to-br from-[#D8AF7F] via-[#C5A27D] to-[#B89968] rounded-3xl border-2 border-gold/30 shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-8 py-6 bg-black/20 border-b border-black/10">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-3xl font-bold text-black">
              Forgot Password?
            </h2>
            <button
              onClick={handleClose}
              className="text-black/60 hover:text-black transition-colors duration-300 text-3xl leading-none"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          {message.text && (
            <div
              className={`mb-4 p-4 rounded-xl text-sm text-center ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          <p className="text-black/80 text-sm mb-6">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-black/80 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/50 border-2 border-black/20 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 text-black placeholder-black/40 transition-all duration-300"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 border-2 border-black/30 text-black font-semibold rounded-xl hover:bg-black/10 transition-all duration-300"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-black text-gold font-semibold rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? "Sending..." : "Send Reset Link"}
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
