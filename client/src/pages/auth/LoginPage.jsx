import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import API_URL from "../../config/api";
import Modal from "../../components/common/Modal";
import OTPModal from "../../components/auth/OTPModal";
import ForgotPasswordModal from "../../components/auth/ForgotPasswordModal";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
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

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (location.state?.message) {
      setInfo(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleLogin = async () => {
    setError("");
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
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/main");
      } else {
        if (data.suspended) {
          setModalConfig({
            title: "Account Suspended",
            message:
              data.message ||
              "Your account has been suspended. Please contact support.",
            type: "error",
          });
          setShowModal(true);
        } else if (data.requiresVerification) {
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
          setModalConfig({
            title: "Account Rejected",
            message:
              data.message ||
              "Your account registration was rejected. Please contact support.",
            type: "error",
          });
          setShowModal(true);
        } else {
          setError(data.message || "Invalid email or password");
        }
      }
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black font-sans">
      <div className="w-full max-w-md mx-4 px-6 py-12 md:px-10 bg-[#1A1A1A] shadow-2xl rounded-2xl border border-[#333] flex flex-col">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-[#D8AF7F] mb-2 font-serif">
            Power Allure
          </h1>
          <p className="text-sm text-gray-400 font-medium">
            Sign in to your account
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="relative">
            <label
              className="block text-xs font-bold text-[#D8AF7F] uppercase tracking-wider mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pb-2 border-b-2 border-gray-600 bg-transparent text-white text-base focus:border-[#D8AF7F] focus:outline-none transition-colors placeholder-gray-500"
              placeholder="Enter your username"
            />
          </div>

          <div className="relative">
            <div className="flex justify-between mb-2">
              <label
                className="block text-xs font-bold text-[#D8AF7F] uppercase tracking-wider"
                htmlFor="password"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-xs font-bold text-gray-400 hover:text-[#D8AF7F] uppercase tracking-wider transition-colors"
              >
                Forgot?
              </button>
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                className="w-full pb-2 border-b-2 border-gray-600 bg-transparent text-white text-base focus:border-[#D8AF7F] focus:outline-none transition-colors pr-10 placeholder-gray-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 text-gray-400 hover:text-[#D8AF7F] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {info && (
            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-md text-sm font-medium border border-blue-100">
              <span>{info}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md text-sm font-medium border border-red-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`mt-6 w-full py-4 rounded-full bg-[#D8AF7F] text-black font-bold text-sm uppercase tracking-widest transition-all duration-300 ${
              isLoading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-[#C9A87C] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            }`}
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#D8AF7F] font-bold hover:underline"
            >
              Apply Now
            </Link>
          </p>
        </div>
      </div>

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

      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={userEmail}
        onSuccess={() => {
          setShowOTPModal(false);
          handleLogin();
        }}
      />

      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
      />
    </div>
  );
};

export default LoginPage;
