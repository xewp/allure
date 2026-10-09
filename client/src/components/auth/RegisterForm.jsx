import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../../config/api";
import OTPModal from "../../components/auth/OTPModal";
import { motion as Motion, AnimatePresence } from "framer-motion";

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
      } catch {
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
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[\d\s+()-]+$/;
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
    } catch {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (id, label, type, value, onChange, placeholder, extraProps = {}) => (
    <div className="w-full">
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-warm-gray" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        disabled={!signupEnabled || loadingConfig}
        className="w-full rounded-lg border border-obsidian/20 bg-white px-4 py-3.5 text-sm text-obsidian outline-none transition placeholder:text-taupe focus:border-oxblood focus:ring-2 focus:ring-oxblood/15 disabled:cursor-not-allowed disabled:bg-obsidian/5 disabled:opacity-60"
        placeholder={placeholder}
        {...extraProps}
      />
    </div>
  );



  return (
    <div className="w-full flex flex-col">
      <div className="mb-9">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-oxblood">
          Membership application
        </p>
        <h2 className="font-serif text-4xl leading-tight text-obsidian sm:text-5xl">Create your account</h2>
        <p className="mt-3 text-sm leading-6 text-warm-gray">Join VELORA to explore our roster and request talent.</p>
        
        <div className="mt-7 flex gap-2" aria-label={`Registration step ${step} of ${totalSteps}`}>
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`h-0.5 flex-1 transition-colors duration-300 ${i <= step ? "bg-oxblood" : "bg-obsidian/15"}`}
            />
          ))}
        </div>
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-taupe">Step {step} of {totalSteps}</p>
      </div>

      {!signupEnabled && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-brass/50 bg-brass/15 p-3 text-xs font-medium text-obsidian" role="status">
          New user registrations are currently unavailable.
        </div>
      )}

      <div className="relative min-h-[230px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <Motion.div 
              key="step1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {renderInput("firstName", "First name", "text", firstName, (e) => setFirstName(e.target.value), "First name", { autoComplete: "given-name" })}
                {renderInput("lastName", "Last name", "text", lastName, (e) => setLastName(e.target.value), "Last name", { autoComplete: "family-name" })}
              </div>
              {renderInput("age", "Age", "number", age, (e) => setAge(e.target.value), "18 or older", { min: "18", max: "120", inputMode: "numeric" })}
            </Motion.div>
          )}

          {step === 2 && (
            <Motion.div 
              key="step2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              {renderInput("email", "Email address", "email", email, (e) => setEmail(e.target.value), "name@example.com", { autoComplete: "email" })}
              {renderInput("phone", "Phone number", "tel", phoneNumber, (e) => setPhoneNumber(e.target.value), "+61 400 000 000", { autoComplete: "tel" })}
            </Motion.div>
          )}

          {step === 3 && (
            <Motion.div 
              key="step3"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              {renderInput("username", "Username", "text", username, (e) => setUsername(e.target.value), "Choose a username", { autoComplete: "username" })}
              
              <div className="w-full">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-warm-gray" htmlFor="password">
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
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-obsidian/20 bg-white py-3.5 pl-4 pr-12 text-sm text-obsidian outline-none transition placeholder:text-taupe focus:border-oxblood focus:ring-2 focus:ring-oxblood/15 disabled:cursor-not-allowed disabled:bg-obsidian/5 disabled:opacity-60"
                    placeholder="At least 6 characters"
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
            </Motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <div className="mt-5 flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 p-3 text-xs font-medium text-danger" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="mt-5 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 p-3 text-xs font-medium text-success" role="status">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>{success}</span>
        </div>
      )}

      <div className="mt-8 flex gap-3">
        {step > 1 && (
          <button
            onClick={handleBack}
            disabled={isLoading}
            className="rounded-lg border border-obsidian/20 px-6 py-3.5 text-sm font-semibold text-obsidian transition hover:border-oxblood hover:text-oxblood focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood"
          >
            Back
          </button>
        )}
        
        {step < totalSteps ? (
          <button
            onClick={handleNext}
            disabled={!signupEnabled || loadingConfig}
            className="flex-1 rounded-lg bg-oxblood py-3.5 text-sm font-semibold text-white transition hover:bg-oxblood-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleRegister}
            disabled={isLoading || !signupEnabled}
            className={`flex-1 rounded-lg bg-oxblood py-3.5 text-sm font-semibold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 ${
              isLoading || !signupEnabled
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-oxblood-dark"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Submitting...
              </span>
            ) : "Complete Setup"}
          </button>
        )}
      </div>

      <div className="mt-8 border-t border-obsidian/10 pt-6 text-center">
        <p className="text-sm text-warm-gray">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-oxblood underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood">
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
