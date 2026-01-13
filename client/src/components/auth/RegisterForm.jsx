import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../../config/api";

/**
 * RegisterForm - Reusable registration form component
 * Handles registration state, validation, and API communication
 */
const RegisterForm = () => {
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
      const response = await fetch(`${API_URL}/auth/register`, {
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

      if (data.success) {
        // Registration successful
        setSuccess("Registration successful! You can now log in.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        // Registration failed
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-lg flex flex-col gap-4">
        {/* Two-column grid for form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name *"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-3 md:p-4 rounded-xl bg-[#c5c4c4] placeholder-gray-600 text-black focus:outline-none"
          />
          <input
            type="text"
            placeholder="Last Name *"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-3 md:p-4 rounded-xl bg-[#c5c4c4] placeholder-gray-600 text-black focus:outline-none"
          />
        </div>

        <input
          type="email"
          placeholder="Email Address *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 md:p-4 rounded-xl bg-[#c5c4c4] placeholder-gray-600 text-black focus:outline-none"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="tel"
            placeholder="Phone Number *"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-3 md:p-4 rounded-xl bg-[#c5c4c4] placeholder-gray-600 text-black focus:outline-none"
          />
          <input
            type="number"
            placeholder="Age *"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min="18"
            max="120"
            className="w-full p-3 md:p-4 rounded-xl bg-[#c5c4c4] placeholder-gray-600 text-black focus:outline-none"
          />
        </div>

        <input
          type="text"
          placeholder="Username *"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 md:p-4 rounded-xl bg-[#c5c4c4] placeholder-gray-600 text-black focus:outline-none"
        />

        <input
          type="password"
          placeholder="Password (min 6 characters) *"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleRegister();
            }
          }}
          className="w-full p-3 md:p-4 rounded-xl bg-[#c5c4c4] placeholder-gray-600 text-black focus:outline-none"
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
        disabled={isLoading}
        className={`mt-6 md:mt-8 px-8 py-3 rounded-full bg-black text-gold font-semibold transition-all hover:scale-105 ${
          isLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-gold"
        }`}
      >
        {isLoading ? "Registering..." : "Register"}
      </button>
      <p className="mt-4 text-black text-sm md:text-base">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold hover:underline">
          Login here
        </Link>
      </p>
    </>
  );
};

export default RegisterForm;
