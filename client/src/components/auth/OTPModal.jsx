import React, { useState, useEffect } from "react";
import API_URL from "../../config/api";

const OTPModal = ({ isOpen, onClose, email, onSuccess, onVerifyLater }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000,
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setOtp("");
      setError("");
      setSuccess("");
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleResendOTP = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/otp-auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("New OTP sent to your email!");
        setResendCooldown(60);
      } else {
        setError(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError("");
    setSuccess("");

    // Validate OTP input
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP code");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/otp-auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#D8AF7F] rounded-2xl p-6 md:p-8 max-w-md w-full">
        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-black">
          Verify Email
        </h2>

        <p className="text-black text-sm md:text-base mb-2">
          A verification code has been sent to:
        </p>
        <p className="text-black text-base md:text-lg font-semibold mb-6">
          {email}
        </p>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ""); // Only digits
            if (value.length <= 6) {
              setOtp(value);
            }
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter" && otp.length === 6) {
              handleVerifyOTP();
            }
          }}
          maxLength={6}
          className="w-full p-3 md:p-4 rounded-xl bg-[#c5c4c4] placeholder-gray-600 text-black text-center text-2xl tracking-widest focus:outline-none mb-4"
        />

        <button
          onClick={handleVerifyOTP}
          disabled={isLoading || otp.length !== 6}
          className={`w-full px-8 py-3 rounded-full font-semibold transition-all text-lg mb-3 ${
            isLoading || otp.length !== 6
              ? "opacity-50 cursor-not-allowed bg-gray-400 text-gray-700"
              : "bg-black text-gold hover:bg-gray-900"
          }`}
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </button>

        <button
          onClick={handleResendOTP}
          disabled={isLoading || resendCooldown > 0}
          className={`w-full text-black text-sm font-medium transition-all py-2 mb-2 ${
            isLoading || resendCooldown > 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:underline"
          }`}
        >
          {resendCooldown > 0
            ? `Resend OTP in ${resendCooldown}s`
            : "Didn't receive code? Resend OTP"}
        </button>

        {error && (
          <div className="text-red-600 text-sm font-semibold text-center bg-red-100 p-3 rounded-lg mt-4">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-600 text-sm font-semibold text-center bg-green-100 p-3 rounded-lg mt-4">
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default OTPModal;
