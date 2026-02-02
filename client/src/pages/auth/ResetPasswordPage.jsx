import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import API_URL from "../../config/api";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const userId = searchParams.get("userId");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [validToken, setValidToken] = useState(false);

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token || !userId) {
        setError("Invalid reset link. Please request a new one.");
        setVerifying(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/users/reset-password/verify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, userId }),
          },
        );

        const data = await response.json();

        if (response.ok) {
          setValidToken(true);
        } else {
          setError(data.message || "Invalid or expired reset token");
        }
      } catch (err) {
        console.error("Token verification error:", err);
        setError("Unable to verify reset link. Please try again.");
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token, userId]);

  const handleSubmit = async () => {
    setError("");

    // Validation
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/users/reset-password/reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, userId, newPassword }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Redirect to login after 5 seconds
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Custom styling for reset password page
  const resetPasswordStyle = {
    justifyContent: "justify-start pt-20 md:pt-32",
    paddingX: "px-4 md:px-0",
    marginLeft: "md:-ml-36",
    headingSize: "text-[70px] md:text-[90px]",
    subheadingSize: "text-xl md:text-2xl",
  };

  if (verifying) {
    return (
      <AuthLayout title="Verifying..." leftSectionStyle={resetPasswordStyle}>
        <div className="w-full max-w-sm md:w-96 flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="text-black/60 text-center">Verifying reset link...</p>
        </div>
      </AuthLayout>
    );
  }

  if (!validToken) {
    return (
      <AuthLayout title="Invalid Link" leftSectionStyle={resetPasswordStyle}>
        <div className="w-full max-w-sm md:w-96 flex flex-col items-center gap-4">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-center font-semibold">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-8 py-3 text-lg rounded-full bg-black text-gold font-semibold hover:scale-105 transition-all"
          >
            Back to Login
          </button>
        </div>
      </AuthLayout>
    );
  }

  if (success) {
    return (
      <AuthLayout title="Success!" leftSectionStyle={resetPasswordStyle}>
        <div className="w-full max-w-sm md:w-96 flex flex-col items-center gap-4">
          <div className="text-6xl mb-4">✓</div>
          <p className="text-green-600 text-center font-semibold text-lg">
            Password reset successfully!
          </p>
          <p className="text-black/60 text-center">
            Redirecting to login page...
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset Password" leftSectionStyle={resetPasswordStyle}>
      <div className="w-full max-w-sm md:w-96 flex flex-col gap-4">
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-4 md:p-5 rounded-xl bg-[#c5c4c4] placeholder-gray-600 text-black text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          className="w-full p-4 md:p-5 rounded-xl bg-[#c5c4c4] placeholder-gray-600 text-black text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
        />
        {error && (
          <div className="text-red-600 text-sm font-semibold text-center bg-red-100 p-3 rounded-lg border border-red-300">
            {error}
          </div>
        )}
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`mt-6 md:mt-8 px-10 md:px-12 py-3 md:py-4 text-lg md:text-xl rounded-full bg-black text-gold font-semibold transition-all hover:scale-105 ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-gold"
        }`}
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
