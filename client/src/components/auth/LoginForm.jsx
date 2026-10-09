import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
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
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
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

        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));
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
    } catch {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = isLoading || isLocked;

  return (
    <div className="w-full flex flex-col">
      <div className="mb-9">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-oxblood">
          Client portal
        </p>
        <h2 className="font-serif text-4xl leading-tight text-obsidian sm:text-5xl">Welcome back</h2>
        <p className="mt-3 text-sm leading-6 text-warm-gray">
          Sign in to discover talent and manage your bookings.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-warm-gray" htmlFor="username">
            Email address
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLocked}
            autoComplete="email"
            className="w-full rounded-lg border border-obsidian/20 bg-white px-4 py-3.5 text-sm text-obsidian outline-none transition placeholder:text-taupe focus:border-oxblood focus:ring-2 focus:ring-oxblood/15 disabled:cursor-not-allowed disabled:bg-obsidian/5 disabled:opacity-60"
            placeholder="name@example.com"
            aria-label="Email address or username"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-warm-gray" htmlFor="password">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPasswordModal(true)}
              className="text-xs font-semibold text-oxblood underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood"
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
              autoComplete="current-password"
              className="w-full rounded-lg border border-obsidian/20 bg-white py-3.5 pl-4 pr-12 text-sm text-obsidian outline-none transition placeholder:text-taupe focus:border-oxblood focus:ring-2 focus:ring-oxblood/15 disabled:cursor-not-allowed disabled:bg-obsidian/5 disabled:opacity-60"
              placeholder="Enter your password"
              aria-label="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-warm-gray transition hover:text-oxblood focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood"
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
            <Motion.div
              key="locked"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col gap-2 rounded-lg border border-danger/30 bg-danger/10 p-4"
              role="alert"
              aria-live="assertive"
              aria-label="Account temporarily locked"
            >
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-danger">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span className="text-xs font-semibold text-danger">Too many failed login attempts</span>
              </div>
              <p className="text-xs text-danger">
                You are temporarily locked. Try again in{" "}
                <span className="font-mono text-sm font-bold">{countdown}</span>
              </p>
            </Motion.div>
          )}

          {/* Warning state — remaining attempts (only show after first failure, not when locked) */}
          {!isLocked && remainingAttempts !== null && remainingAttempts > 0 && (
            <Motion.div
              key="warning"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex items-center gap-2 rounded-lg border border-brass/50 bg-brass/15 p-3"
              role="status"
              aria-live="polite"
              aria-label={`${remainingAttempts} login attempt${remainingAttempts !== 1 ? 's' : ''} remaining`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-brass-dark">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span className="text-xs font-medium text-obsidian">
                You have <span className="font-bold">{remainingAttempts}</span> login attempt{remainingAttempts !== 1 ? 's' : ''} remaining.
              </span>
            </Motion.div>
          )}
        </AnimatePresence>

        {info && (
          <div className="flex items-center gap-2 rounded-lg border border-brass/40 bg-brass/10 p-3 text-xs font-medium text-obsidian" role="status">
            <span>{info}</span>
          </div>
        )}

        {/* General error message (only show when not displaying lockout UI) */}
        {error && !isLocked && (
          <Motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 p-3 text-xs font-medium text-danger"
            role="alert"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{error}</span>
          </Motion.div>
        )}

        {/* Demo Test Account Quick Fill */}
        <div className="flex items-center justify-between gap-3 border-y border-obsidian/10 py-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-brass/50 bg-brass/15 text-brass-dark">
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 0121 9z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-obsidian">Preview account</span>
              <span className="text-[11px] text-warm-gray">Fill the demo credentials</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setUsername("slimeboy");
              setPassword("test123");
              setError("");
            }}
            className="flex-shrink-0 rounded-md border border-obsidian/20 px-3.5 py-2 text-xs font-semibold text-obsidian transition hover:border-oxblood hover:text-oxblood focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood"
          >
            Fill Demo
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={isButtonDisabled}
          className={`mt-2 w-full rounded-lg py-3.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 focus-visible:ring-offset-porcelain ${
            isButtonDisabled
              ? "cursor-not-allowed bg-obsidian/15 text-warm-gray"
              : "bg-oxblood text-white hover:bg-oxblood-dark"
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

      <div className="mt-8 border-t border-obsidian/10 pt-6 text-center">
        <p className="text-sm text-warm-gray">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-oxblood underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood"
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
