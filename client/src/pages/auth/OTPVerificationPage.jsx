import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API_URL from "../../config/api";

const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtpValues = [...otpValues];
    // If they paste a string of numbers
    if (value.length > 1) {
      const pasted = value.slice(0, 6 - index).split('');
      for (let i = 0; i < pasted.length; i++) {
        newOtpValues[index + i] = pasted[i];
      }
      setOtpValues(newOtpValues);
      
      const nextIndex = Math.min(index + pasted.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else {
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);
      
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otpValues[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newOtpValues = [...otpValues];
        newOtpValues[index - 1] = "";
        setOtpValues(newOtpValues);
      } else {
        const newOtpValues = [...otpValues];
        newOtpValues[index] = "";
        setOtpValues(newOtpValues);
      }
    } else if (e.key === "Enter" && otpValues.every(v => v !== "")) {
      handleVerifyOTP();
    }
  };

  const handleVerifyOTP = async () => {
    setError("");
    setSuccess("");

    const otp = otpValues.join("");
    if (otp.length !== 6) {
      setError("Please enter all 6 digits");
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
              message: "Email verified! Your account is awaiting admin approval.",
            },
          });
        }, 2000);
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setSuccess("");

    if (resendCooldown > 0) return;

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
        setResendCooldown(60); 
      } else {
        setError(data.message || "Failed to resend OTP. Please try again.");
      }
    } catch {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-obsidian px-4 py-10 font-sans text-obsidian sm:px-6">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute left-0 top-0 h-px w-full bg-brass/30" />
        <div className="absolute -right-32 top-16 h-72 w-72 rounded-full border border-brass/15" />
        <div className="absolute -left-20 bottom-20 h-48 w-48 rounded-full border border-porcelain/10" />
      </div>

      <section className="relative z-10 w-full max-w-lg border border-porcelain/10 bg-porcelain p-5 shadow-editorial sm:p-9 md:p-12" aria-labelledby="verification-title">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-10 block text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood"
          aria-label="VELORA home"
        >
          <span className="block font-serif text-2xl tracking-[0.14em]">VELORA</span>
          <span className="block text-[8px] font-semibold tracking-[0.3em] text-oxblood">TALENT &amp; EVENTS</span>
        </button>

        <div className="mb-8">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-oxblood">Secure verification</p>
          <h1 id="verification-title" className="font-serif text-4xl leading-tight sm:text-5xl">Check your inbox</h1>
          <p className="mt-4 text-sm leading-6 text-warm-gray">
            Enter the six-digit code sent to
            <span className="mt-1 block break-all font-semibold text-obsidian">{email}</span>
          </p>
        </div>

        <div className="mb-7 grid grid-cols-6 gap-1.5 sm:gap-2" role="group" aria-label="Six-digit verification code">
          {otpValues.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={6}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              aria-label={`Digit ${index + 1}`}
              className="h-12 min-w-0 w-full rounded-md border border-obsidian/20 bg-white text-center text-xl font-semibold text-obsidian outline-none transition focus:border-oxblood focus:ring-2 focus:ring-oxblood/15 sm:h-14 sm:text-2xl"
            />
          ))}
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm font-medium text-danger" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 p-3 text-sm font-medium text-success" role="status">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>{success}</span>
          </div>
        )}

        <button
          onClick={handleVerifyOTP}
          disabled={isLoading || otpValues.some(v => v === "")}
          className={`w-full rounded-lg bg-oxblood py-3.5 text-sm font-semibold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 ${
            isLoading || otpValues.some(v => v === "") ? "cursor-not-allowed opacity-50" : "hover:bg-oxblood-dark"
          }`}
        >
          {isLoading ? "Verifying..." : "Verify email"}
        </button>

        <div className="mt-7 flex flex-col items-center gap-3 border-t border-obsidian/10 pt-6 text-sm">
          <button
            onClick={handleResendOTP}
            disabled={isLoading || resendCooldown > 0}
            className={`font-bold transition-all ${
              isLoading || resendCooldown > 0
                ? "cursor-not-allowed text-taupe"
                : "text-oxblood underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood"
            }`}
          >
            {resendCooldown > 0
              ? `Resend code in ${resendCooldown}s`
              : "Didn't receive a code? Resend"}
          </button>
          
          <button
            onClick={() => navigate("/register")}
            className="text-warm-gray underline-offset-4 transition hover:text-obsidian hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood"
          >
            Wrong email address?
          </button>
        </div>
      </section>
    </main>
  );
};

export default OTPVerificationPage;
