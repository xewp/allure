import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
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
    } catch (err) {
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
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black font-sans">
      <div className="w-full max-w-md mx-4 px-6 py-12 md:px-10 bg-[#1A1A1A] shadow-2xl rounded-2xl border border-[#333] flex flex-col text-center">
        
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-[#D8AF7F] font-serif mb-4">
            Verify Email
          </h1>
          <p className="text-sm text-gray-400 font-medium">
            We've sent a 6-digit code to <br/>
            <span className="font-bold text-white">{email}</span>
          </p>
        </div>

        <div className="flex justify-between gap-2 mb-8">
          {otpValues.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              maxLength={6}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold bg-transparent border-2 border-gray-600 rounded-lg text-white focus:border-[#D8AF7F] focus:outline-none focus:ring-1 focus:ring-[#D8AF7F] transition-all"
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center justify-center gap-2 text-red-600 bg-red-50 p-3 rounded-md text-sm font-medium border border-red-100 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-3 rounded-md text-sm font-medium border border-green-100 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>{success}</span>
          </div>
        )}

        <button
          onClick={handleVerifyOTP}
          disabled={isLoading || otpValues.some(v => v === "")}
          className={`w-full py-4 rounded-full bg-[#D8AF7F] text-black font-bold text-sm uppercase tracking-widest transition-all duration-300 ${
            isLoading || otpValues.some(v => v === "") ? "opacity-70 cursor-not-allowed" : "hover:bg-[#C9A87C] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          }`}
        >
          {isLoading ? "Verifying..." : "Verify Identity"}
        </button>

        <div className="mt-8 flex flex-col gap-3 text-sm">
          <button
            onClick={handleResendOTP}
            disabled={isLoading || resendCooldown > 0}
            className={`font-bold transition-all ${
              isLoading || resendCooldown > 0
                ? "text-gray-600 cursor-not-allowed"
                : "text-[#D8AF7F] hover:underline"
            }`}
          >
            {resendCooldown > 0
              ? `Resend code in ${resendCooldown}s`
              : "Didn't receive a code? Resend"}
          </button>
          
          <button
            onClick={() => navigate("/register")}
            className="text-gray-400 hover:text-white hover:underline transition-colors"
          >
            Wrong email address?
          </button>
        </div>

      </div>
    </div>
  );
};

export default OTPVerificationPage;
