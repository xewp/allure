import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (verifying) {
      return (
        <div className="flex flex-col items-center gap-6 py-8">
          <div className="w-16 h-16 border-4 border-[#333] border-t-[#D8AF7F] rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium tracking-wider">Verifying link...</p>
        </div>
      );
    }

    if (!validToken) {
      return (
        <div className="flex flex-col items-center gap-6 py-8 text-center">
          <div className="text-5xl">⚠️</div>
          <p className="text-red-400 font-bold">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-8 py-4 rounded-full bg-[#333] text-white font-bold text-sm uppercase tracking-widest transition-all hover:bg-[#444]"
          >
            Back to Login
          </button>
        </div>
      );
    }

    if (success) {
      return (
        <div className="flex flex-col items-center gap-6 py-8 text-center">
          <div className="text-5xl text-green-500">✓</div>
          <h2 className="text-2xl font-bold text-[#D8AF7F]">Success!</h2>
          <p className="text-gray-400">Password reset successfully.</p>
          <p className="text-sm text-gray-500 mt-4">Redirecting to login...</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        <div className="relative">
          <label className="block text-xs font-bold text-[#D8AF7F] uppercase tracking-wider mb-2">
            New Password
          </label>
          <input
            type="password"
            placeholder="Min 6 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full pb-2 border-b-2 border-gray-600 bg-transparent text-white text-base focus:border-[#D8AF7F] focus:outline-none transition-colors placeholder-gray-500"
          />
        </div>
        <div className="relative">
          <label className="block text-xs font-bold text-[#D8AF7F] uppercase tracking-wider mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            className="w-full pb-2 border-b-2 border-gray-600 bg-transparent text-white text-base focus:border-[#D8AF7F] focus:outline-none transition-colors placeholder-gray-500"
          />
        </div>
        
        {error && (
          <div className="text-red-400 text-sm font-bold text-center bg-red-950/50 p-3 rounded-lg border border-red-900/50">
            {error}
          </div>
        )}
        
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`mt-4 w-full py-4 rounded-full bg-[#D8AF7F] text-black font-bold text-sm uppercase tracking-widest transition-all hover:bg-[#C9A87C] disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black font-sans">
      <div className="w-full max-w-md mx-4 px-6 py-12 md:px-10 bg-[#1A1A1A] shadow-2xl rounded-2xl border border-[#333] flex flex-col">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-[#D8AF7F] mb-2 font-serif">
            Power Allure
          </h1>
          <p className="text-sm text-gray-400 font-medium">
            Reset Your Password
          </p>
        </div>

        {renderContent()}

      </div>
    </div>
  );
};

export default ResetPasswordPage;
