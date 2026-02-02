import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../../config/api";
import OTPModal from "./OTPModal";

/**
 * RegisterForm - Reusable registration form component
 * Handles registration state, validation, and API communication
 */
const RegisterForm = ({ signupEnabled = true }) => {
  const navigate = useNavigate();

  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [age, setAge] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // OTP Modal state
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  // Client-side validation
  const validateEmail = (email) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.length >= 7;
  };

  const handleRegister = async () => {
    // Clear previous errors and successes
    setError("");
    setSuccess("");

    // Validate inputs
    if (
      !username ||
      !password ||
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !age
    ) {
      setError("Please fill in all required fields");
      return;
    }

    // Email validation
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Phone number validation
    if (!validatePhoneNumber(phoneNumber)) {
      setError("Please enter a valid phone number");
      return;
    }

    // Age validation
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
      setError("Age must be between 18 and 120");
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
          age: ageNum,
        }),
      });

      const data = await response.json();

      // Check if signup is disabled (403 status)
      if (response.status === 403) {
        setError(
          data.message ||
            "New user registrations are currently disabled. Please contact support.",
        );
        return;
      }

      if (data.success) {
        // Registration successful - show OTP modal
        setSuccess(
          "Registration successful! Please check your email for the verification code.",
        );
        setRegisteredEmail(email);
        setShowOTPModal(true);
      } else {
        // Registration failed with generic error
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {

      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-lg flex flex-col gap-4">
        {/* Signup Disabled Warning */}
        {!signupEnabled && (
          <div className="text-orange-700 text-sm font-semibold text-center bg-orange-100 p-4 rounded-lg border-2 border-orange-400">
            ⚠️ New user registrations are currently disabled. Please contact
            support for assistance.
          </div>
        )}

        {/* Two-column grid for form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name *"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={!signupEnabled}
            className="w-full p-3 md:p-4 rounded-lg bg-[#D8AF7F] placeholder-black/70 text-black focus:outline-none focus:ring-2 focus:ring-[#C9A87C] disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <input
            type="text"
            placeholder="Last Name *"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={!signupEnabled}
            className="w-full p-3 md:p-4 rounded-lg bg-[#D8AF7F] placeholder-black/70 text-black focus:outline-none focus:ring-2 focus:ring-[#C9A87C] disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <input
          type="email"
          placeholder="Email Address *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!signupEnabled}
          className="w-full p-3 md:p-4 rounded-lg bg-[#D8AF7F] placeholder-black/70 text-black focus:outline-none focus:ring-2 focus:ring-[#C9A87C] disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="tel"
            placeholder="Phone Number *"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={!signupEnabled}
            className="w-full p-3 md:p-4 rounded-lg bg-[#D8AF7F] placeholder-black/70 text-black focus:outline-none focus:ring-2 focus:ring-[#C9A87C] disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <input
            type="number"
            placeholder="Age *"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min="18"
            max="120"
            disabled={!signupEnabled}
            className="w-full p-3 md:p-4 rounded-lg bg-[#D8AF7F] placeholder-black/70 text-black focus:outline-none focus:ring-2 focus:ring-[#C9A87C] disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <input
          type="text"
          placeholder="Username *"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={!signupEnabled}
          className="w-full p-3 md:p-4 rounded-lg bg-[#D8AF7F] placeholder-black/70 text-black focus:outline-none focus:ring-2 focus:ring-[#C9A87C] disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <input
          type="password"
          placeholder="Password (min 6 characters) *"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && signupEnabled) {
              handleRegister();
            }
          }}
          disabled={!signupEnabled}
          className="w-full p-3 md:p-4 rounded-lg bg-[#D8AF7F] placeholder-black/70 text-black focus:outline-none focus:ring-2 focus:ring-[#C9A87C] disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {error && (
          <div className="text-red-600 text-sm font-semibold text-center bg-red-100 p-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-600 text-sm font-semibold text-center bg-green-100 p-3 rounded-lg">
            {success}
          </div>
        )}
      </div>
      <button
        onClick={handleRegister}
        disabled={isLoading || !signupEnabled}
        className={`mt-6 md:mt-8 px-8 md:px-10 py-2 md:py-3 text-base md:text-lg rounded-md bg-[#D8AF7F] text-black font-normal transition-all hover:bg-[#C9A87C] ${
          isLoading || !signupEnabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isLoading
          ? "Registering..."
          : !signupEnabled
            ? "Registrations Disabled"
            : "Register"}
      </button>
      <p className="mt-4 text-black text-sm md:text-base">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold hover:underline">
          Login here
        </Link>
      </p>

      {/* OTP Verification Modal */}
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={registeredEmail}
        onSuccess={() => {
          setShowOTPModal(false);
          navigate("/login", {
            state: {
              message:
                "Email verified! Your account is awaiting admin approval.",
            },
          });
        }}
      />
    </>
  );
};

export default RegisterForm;
