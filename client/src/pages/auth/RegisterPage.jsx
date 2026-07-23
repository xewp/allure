import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../../config/api";
import OTPModal from "../../components/auth/OTPModal";

const RegisterPage = () => {
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
    <div className="relative w-full">
      <label className="block text-xs font-bold text-[#D8AF7F] uppercase tracking-wider mb-2" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        disabled={!signupEnabled}
        className="w-full pb-2 border-b-2 border-gray-600 bg-transparent text-white text-base focus:border-[#D8AF7F] focus:outline-none transition-colors placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        placeholder={placeholder}
        {...extraProps}
      />
    </div>
  );

  if (loadingConfig) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F9F9F9] font-sans">
        <p className="text-black font-bold uppercase tracking-widest">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black font-sans py-12">
      <div className="w-full max-w-lg mx-4 px-6 py-10 md:px-12 bg-[#1A1A1A] shadow-2xl rounded-2xl border border-[#333] flex flex-col relative overflow-hidden">
        
        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[#333]">
          <div 
            className="h-full bg-[#D8AF7F] transition-all duration-300 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        <div className="text-center mb-8 mt-2">
          <h1 className="text-3xl font-bold tracking-tight text-[#D8AF7F] font-serif mb-2">
            Power Allure
          </h1>
          <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">
            Step {step} of {totalSteps}
          </p>
        </div>

        {!signupEnabled && (
          <div className="mb-6 flex items-center justify-center gap-2 text-orange-400 bg-orange-950/50 p-3 rounded-md text-sm font-medium border border-orange-900/50">
            ⚠️ New user registrations are currently disabled.
          </div>
        )}

        <div className="flex flex-col gap-6">
          {step === 1 && (
            <div className="flex flex-col gap-6 animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput("firstName", "First Name", "text", firstName, (e) => setFirstName(e.target.value), "John")}
                {renderInput("lastName", "Last Name", "text", lastName, (e) => setLastName(e.target.value), "Doe")}
              </div>
              {renderInput("age", "Age", "number", age, (e) => setAge(e.target.value), "18+", { min: "18", max: "120" })}
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-6 animate-fade-in-up">
              {renderInput("email", "Email Address", "email", email, (e) => setEmail(e.target.value), "john@example.com")}
              {renderInput("phone", "Phone Number", "tel", phoneNumber, (e) => setPhoneNumber(e.target.value), "+1 (555) 000-0000")}
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-6 animate-fade-in-up">
              {renderInput("username", "Username", "text", username, (e) => setUsername(e.target.value), "johndoe")}
              
              <div className="relative w-full">
                <label className="block text-xs font-bold text-[#D8AF7F] uppercase tracking-wider mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && signupEnabled) {
                        handleRegister();
                      }
                    }}
                    disabled={!signupEnabled}
                    className="w-full pb-2 border-b-2 border-gray-600 bg-transparent text-white text-base focus:border-[#D8AF7F] focus:outline-none transition-colors pr-10 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Min 6 characters"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 text-gray-400 hover:text-[#D8AF7F] transition-colors"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md text-sm font-medium border border-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md text-sm font-medium border border-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span>{success}</span>
            </div>
          )}

          <div className="flex gap-4 mt-6">
            {step > 1 && (
              <button
                onClick={handleBack}
                disabled={isLoading}
                className="w-1/3 py-4 rounded-full bg-[#333] text-white font-bold text-sm uppercase tracking-widest transition-all hover:bg-[#444]"
              >
                Back
              </button>
            )}
            
            {step < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={!signupEnabled}
                className="flex-1 py-4 rounded-full bg-[#D8AF7F] text-black font-bold text-sm uppercase tracking-widest transition-all hover:bg-[#C9A87C] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleRegister}
                disabled={isLoading || !signupEnabled}
                className="flex-1 py-4 rounded-full bg-[#D8AF7F] text-black font-bold text-sm uppercase tracking-widest transition-all hover:bg-[#C9A87C] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Submitting..." : "Apply"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-[#D8AF7F] font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
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

export default RegisterPage;
