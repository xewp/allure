import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../config/api";
import Modal from "../common/Modal";
import OTPModal from "./OTPModal";
import ForgotPasswordModal from "./ForgotPasswordModal";

/**
 * LoginForm - Reusable login form component
 * Handles login state, validation, and API communication
 */
const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    type: "info",
  });

  // OTP Modal state
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Forgot Password Modal state
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // Clear any stale tokens when login form loads
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const handleLogin = async () => {
    // Clear previous errors
    setError("");

    // Validate inputs
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/otp-auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Login successful
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/main");
      } else {
        // Check for specific error conditions
        if (data.suspended) {
          // Show modal for suspended account
          setModalConfig({
            title: "Account Suspended",
            message:
              data.message ||
              "Your account has been suspended. Please contact support for assistance.",
            type: "error",
          });
          setShowModal(true);
        } else if (data.requiresVerification) {
          // Email not verified - store email for OTP verification
          setUserEmail(username);
          setModalConfig({
            title: "Email Verification Required",
            message:
              data.message ||
              "Please verify your email before logging in. Check your inbox for the OTP code.",
            type: "warning",
          });
          setShowModal(true);
        } else if (data.requiresApproval) {
          // Account pending approval
          setModalConfig({
            title: "Awaiting Admin Approval",
            message:
              data.message ||
              "Your account is awaiting admin approval. You will be notified once approved.",
            type: "info",
          });
          setShowModal(true);
        } else if (
          response.status === 403 &&
          data.message?.includes("rejected")
        ) {
          // Account rejected
          setModalConfig({
            title: "Account Rejected",
            message:
              data.message ||
              "Your account registration was rejected. Please contact support for more information.",
            type: "error",
          });
          setShowModal(true);
        } else {
          // Show generic error
          setError(data.message || "Invalid email or password");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-sm md:w-96 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter email or username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-4 md:p-5 rounded-xl bg-[#c5c4c4] placeholder-gray-600 text-black text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
          className="w-full p-4 md:p-5 rounded-xl bg-[#c5c4c4] placeholder-gray-600 text-black text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
        />

        {/* Forgot Password Link */}
        <div className="text-right">
          <button
            type="button"
            onClick={() => setShowForgotPasswordModal(true)}
            className="text-black hover:text-black/70 text-sm font-semibold underline transition-colors"
          >
            Forgot Password?
          </button>
        </div>

        {error && (
          <div className="text-red-600 text-sm font-semibold text-center bg-red-100 p-3 rounded-lg border border-red-300">
            {error}
          </div>
        )}
      </div>
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className={`mt-6 md:mt-8 px-10 md:px-12 py-3 md:py-4 text-lg md:text-xl rounded-full bg-black text-gold font-semibold transition-all hover:scale-105 ${
          isLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-gold"
        }`}
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>

      {/* Suspended Account Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        actionText={
          modalConfig.title === "Email Verification Required"
            ? "Verify Email"
            : undefined
        }
        onAction={
          modalConfig.title === "Email Verification Required"
            ? () => setShowOTPModal(true)
            : undefined
        }
      />

      {/* OTP Verification Modal */}
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={userEmail}
        onSuccess={() => {
          setShowOTPModal(false);
          // After verification, attempt login again automatically
          handleLogin();
        }}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
      />
    </>
  );
};

export default LoginForm;
