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
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

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
    } catch {

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
    } catch {

      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/85 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md border border-porcelain/10 bg-porcelain p-6 text-obsidian shadow-editorial sm:p-9"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="otp-modal-title"
      >
        <div className="mb-7 flex items-start justify-between gap-6">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-oxblood">Secure verification</p>
            <h2 id="otp-modal-title" className="font-serif text-3xl leading-tight sm:text-4xl">Verify your email</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center text-2xl text-warm-gray transition hover:text-oxblood focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood"
            aria-label="Close verification dialog"
          >
            ×
          </button>
        </div>

        <p className="mb-1 text-sm text-warm-gray">
          A verification code has been sent to:
        </p>
        <p className="mb-6 break-all text-sm font-semibold text-obsidian">
          {email}
        </p>

        <label htmlFor="otp-code" className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-warm-gray">
          Six-digit code
        </label>
        <input
          id="otp-code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-describedby="otp-code-hint"
          placeholder="000000"
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
          className="mb-2 w-full rounded-lg border border-obsidian/20 bg-white p-3.5 text-center text-2xl font-semibold tracking-[0.4em] text-obsidian outline-none transition placeholder:text-taupe/70 focus:border-oxblood focus:ring-2 focus:ring-oxblood/15"
        />
        <p id="otp-code-hint" className="mb-5 text-xs text-taupe">Codes expire for your security.</p>

        <button
          onClick={handleVerifyOTP}
          disabled={isLoading || otp.length !== 6}
          className={`mb-3 w-full rounded-lg px-8 py-3.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 ${
            isLoading || otp.length !== 6
              ? "cursor-not-allowed bg-obsidian/15 text-warm-gray"
              : "bg-oxblood text-white hover:bg-oxblood-dark"
          }`}
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </button>

        <button
          onClick={handleResendOTP}
          disabled={isLoading || resendCooldown > 0}
          className={`mb-2 w-full py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood ${
            isLoading || resendCooldown > 0
              ? "cursor-not-allowed text-taupe"
              : "text-oxblood underline-offset-4 hover:underline"
          }`}
        >
          {resendCooldown > 0
            ? `Resend OTP in ${resendCooldown}s`
            : "Didn't receive code? Resend OTP"}
        </button>

        {error && (
          <div className="mt-4 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm font-medium text-danger" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 rounded-lg border border-success/30 bg-success/10 p-3 text-sm font-medium text-success" role="status">
            {success}
          </div>
        )}

        {onVerifyLater && (
          <button
            type="button"
            onClick={onVerifyLater}
            className="mt-4 w-full py-2 text-sm font-medium text-warm-gray underline-offset-4 transition hover:text-obsidian hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood"
          >
            Verify later
          </button>
        )}
      </div>
    </div>
  );
};

export default OTPModal;
