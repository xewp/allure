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
    } catch (error) {

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
        className="relative w-full max-w-md bg-[#1A1A1A] rounded-2xl border border-[#333] shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-8 py-6 border-b border-[#333]">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-3xl font-bold text-[#D8AF7F]">
              Forgot Password?
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-white transition-colors duration-300 text-3xl leading-none"
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

          <p className="text-gray-400 text-sm mb-6">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#D8AF7F] uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pb-2 border-b-2 border-gray-600 bg-transparent text-white text-base focus:border-[#D8AF7F] focus:outline-none transition-colors placeholder-gray-500"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-4 rounded-full bg-[#333] text-white font-bold text-sm uppercase tracking-widest transition-all hover:bg-[#444]"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 rounded-full bg-[#D8AF7F] text-black font-bold text-sm uppercase tracking-widest transition-all hover:bg-[#C9A87C] disabled:opacity-50 disabled:cursor-not-allowed"
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
