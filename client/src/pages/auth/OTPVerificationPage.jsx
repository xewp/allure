import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import API_URL from "../../config/api";

/**
 * OTPVerificationPage - Email verification with OTP code
 * User lands here after registration to verify their email
 */
const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

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
          navigate("/login", {
            state: {
              message:
                "Email verified! Your account is awaiting admin approval.",
            },
          });
        }, 2000);
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {

      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setSuccess("");

    if (resendCooldown > 0) {
      return;
    }

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
        setSuccess(data.message || "New OTP sent to your email!");
        setResendCooldown(60); // 60 second cooldown
      } else {
        setError(data.message || "Failed to resend OTP. Please try again.");
      }
    } catch (err) {

      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Verify Email">
      <div className="w-full max-w-lg flex flex-col gap-4">
        <p className="text-black text-sm md:text-base mb-4">
          We've sent a 6-digit verification code to{" "}
          <span className="font-semibold">{email}</span>
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
            if (e.key === "Enter") {
              handleVerifyOTP();
            }
          }}
          maxLength={6}
          className="w-full p-3 md:p-4 rounded-xl bg-[#c5c4c4] placeholder-gray-600 text-black text-center text-2xl tracking-widest focus:outline-none"
        />

        {error && (
          <div className="text-red-600 text-sm font-semibold text-center bg-red-100 p-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-600 text-sm font-semibold text-center bg-green-100 p-3 rounded-lg">
            {success}
          </div>
        )}

        <button
          onClick={handleVerifyOTP}
          disabled={isLoading || otp.length !== 6}
          className={`mt-4 px-8 py-3 rounded-full bg-black text-gold font-semibold transition-all hover:scale-105 ${
            isLoading || otp.length !== 6
              ? "opacity-50 cursor-not-allowed"
              : "hover:shadow-gold"
          }`}
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </button>

        <button
          onClick={handleResendOTP}
          disabled={isLoading || resendCooldown > 0}
          className={`text-black text-sm underline hover:no-underline transition-all ${
            isLoading || resendCooldown > 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {resendCooldown > 0
            ? `Resend OTP in ${resendCooldown}s`
            : "Didn't receive code? Resend OTP"}
        </button>

        <p className="mt-4 text-black text-sm md:text-base text-center">
          Wrong email?{" "}
          <span
            onClick={() => navigate("/register")}
            className="font-semibold hover:underline cursor-pointer"
          >
            Go back to registration
          </span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default OTPVerificationPage;
