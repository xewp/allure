import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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

  // ── Security state ──
  const [remainingAttempts, setRemainingAttempts] = useState(null); // null = never failed
  const [lockedUntil, setLockedUntil] = useState(null); // ISO timestamp from server
  const [countdown, setCountdown] = useState(""); // "MM:SS" display
  const [isLocked, setIsLocked] = useState(false);
  const countdownRef = useRef(null);

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

  // ── Countdown timer logic ──
  const startCountdown = useCallback((lockExpiry) => {
    // Clear any existing interval
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    const expiryTime = new Date(lockExpiry).getTime();

    const tick = () => {
      const now = Date.now();
      const diff = expiryTime - now;

      if (diff <= 0) {
        // Lock expired — reset everything
        clearInterval(countdownRef.current);
        countdownRef.current = null;
        setIsLocked(false);
        setLockedUntil(null);
        setCountdown("");
        setRemainingAttempts(null);
        setError("");
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setCountdown(
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      );
    };

    // Run immediately, then every second
    tick();
    countdownRef.current = setInterval(tick, 1000);
  }, []);

  // Start countdown when lockedUntil changes
  useEffect(() => {
    if (lockedUntil) {
      const expiryTime = new Date(lockedUntil).getTime();
      if (expiryTime > Date.now()) {
        setIsLocked(true);
        startCountdown(lockedUntil);
      }
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [lockedUntil, startCountdown]);

  const handleLogin = async () => {
    setError("");
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    // Don't attempt if locked
    if (isLocked) return;

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
        // Successful login — clear security state
        setRemainingAttempts(null);
        setLockedUntil(null);
        setIsLocked(false);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/main");
      } else {
        // ── Handle security metadata ──
        if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts);
        }

        if (data.lockedUntil) {
          setLockedUntil(data.lockedUntil);
        }

        // Handle specific modals
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
        } else if (response.status === 429) {
          // Rate limited — lockedUntil is already set above
          setError(data.message || "Too many login attempts. Please try again later.");
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

  const isButtonDisabled = isLoading || isLocked;

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
            disabled={isLocked}
            className="w-full px-4 py-3 bg-[#111] border border-[#222] rounded-xl text-white text-sm focus:border-[#D8AF7F] focus:ring-1 focus:ring-[#D8AF7F] outline-none transition-all placeholder-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter your email"
            aria-label="Email address or username"
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
              onKeyDown={(e) => e.key === "Enter" && !isButtonDisabled && handleLogin()}
              disabled={isLocked}
              className="w-full px-4 py-3 bg-[#111] border border-[#222] rounded-xl text-white text-sm focus:border-[#D8AF7F] focus:ring-1 focus:ring-[#D8AF7F] outline-none transition-all pr-12 placeholder-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="••••••••"
              aria-label="Password"
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

        {/* ── Security Status Messages ── */}
        <AnimatePresence mode="wait">
          {/* Locked state — red banner with countdown */}
          {isLocked && (
            <motion.div
              key="locked"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
              role="alert"
              aria-live="assertive"
              aria-label="Account temporarily locked"
            >
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 flex-shrink-0">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span className="text-red-400 text-xs font-semibold">Too many failed login attempts</span>
              </div>
              <p className="text-red-400/80 text-xs">
                You are temporarily locked. Try again in{" "}
                <span className="font-mono font-bold text-red-300 text-sm">{countdown}</span>
              </p>
            </motion.div>
          )}

          {/* Warning state — remaining attempts (only show after first failure, not when locked) */}
          {!isLocked && remainingAttempts !== null && remainingAttempts > 0 && (
            <motion.div
              key="warning"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20"
              role="status"
              aria-live="polite"
              aria-label={`${remainingAttempts} login attempt${remainingAttempts !== 1 ? 's' : ''} remaining`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400 flex-shrink-0">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span className="text-amber-400 text-xs font-medium">
                You have <span className="font-bold">{remainingAttempts}</span> login attempt{remainingAttempts !== 1 ? 's' : ''} remaining.
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {info && (
          <div className="flex items-center gap-2 text-blue-400 bg-blue-500/10 p-3 rounded-lg text-xs font-medium border border-blue-500/20">
            <span>{info}</span>
          </div>
        )}

        {/* General error message (only show when not displaying lockout UI) */}
        {error && !isLocked && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg text-xs font-medium border border-red-500/20"
            role="alert"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{error}</span>
          </motion.div>
        )}

        {/* Demo Test Account Fill Button */}
        <div className="p-3 bg-[#141414] border border-[#262626] rounded-xl flex items-center justify-between gap-3 text-xs">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-gray-300 font-medium">
              <svg className="w-3.5 h-3.5 text-[#D8AF7F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 0121 9z" />
              </svg>
              <span>Test Account</span>
            </div>
            <p className="text-[11px] text-gray-400">
              User: <span className="font-mono text-[#D8AF7F] font-semibold">slimeboy</span> &nbsp;|&nbsp; Pass: <span className="font-mono text-[#D8AF7F] font-semibold">test123</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setUsername("slimeboy");
              setPassword("test123");
              setError("");
            }}
            className="px-3 py-1.5 bg-[#D8AF7F] hover:bg-[#c49a6c] text-black rounded-lg text-xs font-semibold transition-all hover:shadow-[0_0_12px_rgba(216,175,127,0.3)] active:scale-95 flex-shrink-0"
          >
            Use Demo
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={isButtonDisabled}
          className={`mt-4 w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
            isButtonDisabled
              ? "bg-[#333] text-gray-500 cursor-not-allowed opacity-70"
              : "bg-white text-black hover:bg-[#D8AF7F] hover:shadow-[0_0_20px_rgba(216,175,127,0.3)] hover:-translate-y-0.5 active:translate-y-0"
          }`}
          aria-label={isLocked ? "Login disabled — account temporarily locked" : "Sign in"}
          aria-disabled={isButtonDisabled}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Signing in...
            </span>
          ) : isLocked ? (
            <span className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Locked
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
