import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import API_URL from "../../config/api";
import Modal from "../../components/common/Modal";
import OTPModal from "../../components/auth/OTPModal";
import ForgotPasswordModal from "../../components/auth/ForgotPasswordModal";

const LoginForm = () => {
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
    <div className="w-full flex flex-col">
      <div className="mb-10">
        <h2 className="text-3xl font-semibold text-white mb-2 tracking-tight">Welcome back</h2>
        <p className="text-gray-400 text-sm">Please enter your details to sign in.</p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="group">
          <label className="block text-xs font-medium text-gray-400 mb-1.5 transition-colors group-focus-within:text-[#D8AF7F]" htmlFor="username">
            Email address
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 bg-[#111] border border-[#222] rounded-xl text-white text-sm focus:border-[#D8AF7F] focus:ring-1 focus:ring-[#D8AF7F] outline-none transition-all placeholder-gray-600"
            placeholder="Enter your email"
          />
        </div>

        <div className="group">
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-medium text-gray-400 transition-colors group-focus-within:text-[#D8AF7F]" htmlFor="password">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPasswordModal(true)}
              className="text-xs font-medium text-gray-400 hover:text-white transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              className="w-full px-4 py-3 bg-[#111] border border-[#222] rounded-xl text-white text-sm focus:border-[#D8AF7F] focus:ring-1 focus:ring-[#D8AF7F] outline-none transition-all pr-12 placeholder-gray-600"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
        </div>

        {info && (
          <div className="flex items-center gap-2 text-blue-400 bg-blue-500/10 p-3 rounded-lg text-xs font-medium border border-blue-500/20">
            <span>{info}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg text-xs font-medium border border-red-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className={`mt-4 w-full py-3.5 rounded-xl bg-white text-black font-semibold text-sm transition-all duration-300 ${
            isLoading
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-[#D8AF7F] hover:shadow-[0_0_20px_rgba(216,175,127,0.3)] hover:-translate-y-0.5 active:translate-y-0"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Signing in...
            </span>
          ) : "Sign in"}
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-white font-medium hover:text-[#D8AF7F] transition-colors"
          >
            Create one
          </Link>
        </p>
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

export default LoginForm;
