import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../../config/api";
import OTPModal from "../../components/auth/OTPModal";
import { motion, AnimatePresence } from "framer-motion";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [signupEnabled, setSignupEnabled] = useState(true);
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    const checkSignupStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/api/settings/public-settings`);
        const data = await response.json();
        if (data.success) {
          setSignupEnabled(data.settings.signupEnabled);
        }
      } catch (err) {
        // Default to enabled
      } finally {
        setLoadingConfig(false);
      }
    };
    checkSignupStatus();
  }, []);

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [age, setAge] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.length >= 7;
  };

  const handleNext = () => {
    setError("");
    if (step === 1) {
      if (!firstName || !lastName || !age) {
        setError("Please fill in all personal details.");
        return;
      }
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
        setError("Age must be between 18 and 120.");
        return;
      }
    } else if (step === 2) {
      if (!email || !phoneNumber) {
        setError("Please fill in all contact details.");
        return;
      }
      if (!validateEmail(email)) {
        setError("Please enter a valid email address.");
        return;
      }
      if (!validatePhoneNumber(phoneNumber)) {
        setError("Please enter a valid phone number.");
        return;
      }
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError("");
    setStep((s) => s - 1);
  };

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!username || !password) {
      setError("Please provide a username and password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/otp-auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          firstName,
          lastName,
          email,
          phoneNumber,
          age: parseInt(age),
        }),
      });

      const data = await response.json();

      if (response.status === 403) {
        setError(data.message || "New user registrations are currently disabled. Please contact support.");
        setIsLoading(false);
        return;
      }

      if (data.success) {
        setSuccess("Application received! Please check your email for the verification code.");
        setRegisteredEmail(email);
        setShowOTPModal(true);
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (id, label, type, value, onChange, placeholder, extraProps = {}) => (
    <div className="group w-full">
      <label className="block text-xs font-medium text-gray-400 mb-1.5 transition-colors group-focus-within:text-[#D8AF7F]" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        disabled={!signupEnabled}
        className="w-full px-4 py-3 bg-[#111] border border-[#222] rounded-xl text-white text-sm focus:border-[#D8AF7F] focus:ring-1 focus:ring-[#D8AF7F] outline-none transition-all placeholder-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        placeholder={placeholder}
        {...extraProps}
      />
    </div>
  );



  return (
    <div className="w-full flex flex-col">
      <div className="mb-10">
        <h2 className="text-3xl font-semibold text-white mb-2 tracking-tight">Create an account</h2>
        <p className="text-gray-400 text-sm">Join Aura Select and elevate your lifestyle.</p>
        
        {/* Progress Bar */}
        <div className="mt-6 flex gap-2">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= step ? 'bg-[#D8AF7F]' : 'bg-[#222]'}`}
            />
          ))}
        </div>
      </div>

      {!signupEnabled && (
        <div className="mb-6 flex items-center gap-2 text-orange-400 bg-orange-500/10 p-3 rounded-lg text-xs font-medium border border-orange-500/20">
          ⚠️ New user registrations are currently disabled.
        </div>
      )}

      <div className="relative min-h-[220px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5"
            >
              <div className="grid grid-cols-2 gap-4">
                {renderInput("firstName", "First Name", "text", firstName, (e) => setFirstName(e.target.value), "John")}
                {renderInput("lastName", "Last Name", "text", lastName, (e) => setLastName(e.target.value), "Doe")}
              </div>
              {renderInput("age", "Age", "number", age, (e) => setAge(e.target.value), "18+", { min: "18", max: "120" })}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5"
            >
              {renderInput("email", "Email Address", "email", email, (e) => setEmail(e.target.value), "john@example.com")}
              {renderInput("phone", "Phone Number", "tel", phoneNumber, (e) => setPhoneNumber(e.target.value), "+1 (555) 000-0000")}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5"
            >
              {renderInput("username", "Username", "text", username, (e) => setUsername(e.target.value), "johndoe")}
              
              <div className="group w-full">
                <label className="block text-xs font-medium text-gray-400 mb-1.5 transition-colors group-focus-within:text-[#D8AF7F]" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && signupEnabled && handleRegister()}
                    disabled={!signupEnabled}
                    className="w-full px-4 py-3 bg-[#111] border border-[#222] rounded-xl text-white text-sm focus:border-[#D8AF7F] focus:ring-1 focus:ring-[#D8AF7F] outline-none transition-all pr-12 placeholder-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Min 6 characters"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <div className="mt-5 flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg text-xs font-medium border border-red-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="mt-5 flex items-center gap-2 text-green-400 bg-green-500/10 p-3 rounded-lg text-xs font-medium border border-green-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>{success}</span>
        </div>
      )}

      <div className="flex gap-3 mt-8">
        {step > 1 && (
          <button
            onClick={handleBack}
            disabled={isLoading}
            className="px-6 py-3.5 rounded-xl bg-[#222] text-white font-semibold text-sm transition-all hover:bg-[#333]"
          >
            Back
          </button>
        )}
        
        {step < totalSteps ? (
          <button
            onClick={handleNext}
            disabled={!signupEnabled}
            className="flex-1 py-3.5 rounded-xl bg-white text-black font-semibold text-sm transition-all hover:bg-[#D8AF7F] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleRegister}
            disabled={isLoading || !signupEnabled}
            className={`flex-1 py-3.5 rounded-xl bg-white text-black font-semibold text-sm transition-all duration-300 ${
              isLoading || !signupEnabled
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-[#D8AF7F] hover:shadow-[0_0_20px_rgba(216,175,127,0.3)] hover:-translate-y-0.5 active:translate-y-0"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Submitting...
              </span>
            ) : "Complete Setup"}
          </button>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-white font-medium hover:text-[#D8AF7F] transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={registeredEmail}
        onSuccess={() => {
          setShowOTPModal(false);
          navigate("/login", {
            state: { message: "Email verified! Your account is awaiting admin approval." },
          });
        }}
      />
    </div>
  );
};

export default RegisterForm;
