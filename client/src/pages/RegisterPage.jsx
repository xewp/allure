import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../config/api";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState(new Set());

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

      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px",
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections(
            (prev) => new Set([...prev, entry.target.dataset.section])
          );
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    const sections = document.querySelectorAll("[data-section]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex h-screen w-full bg-[#D8AF7F]">
      {/* Left Section with Black Background and Diagonal Cut - Hidden on Mobile */}
      <div
        data-section="left"
        className={`hidden md:flex relative md:w-1/2 h-full bg-black flex-col justify-center pl-8 md:pl-16 z-10 transition-all duration-1000 ${
          visibleSections.has("left")
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-10"
        }`}
        style={{ clipPath: "polygon(0 0, 100% 0, 60% 100%, 0 100%)" }}
      >
        <h1 className="text-[#D8AF7F] text-4xl md:text-5xl font-bold mb-4">
          Power Allure
        </h1>
        <p className="text-[#D8AF7F] text-base md:text-lg">
          Feel the power. Own the allure.
        </p>
      </div>

      {/* Right Section with Tan Background and Register Form */}
      <div className="w-full md:w-auto md:absolute md:inset-0 flex md:justify-end justify-center items-center z-0">
        <div
          data-section="right"
          className={`w-full md:w-1/2 flex flex-col items-center px-4 md:px-8 py-8 transition-all duration-1000 delay-300 overflow-y-auto max-h-screen ${
            visibleSections.has("right")
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-10"
          }`}
        >
          <h2 className="text-black text-3xl md:text-4xl font-bold mb-6 md:mb-8">
            Register
          </h2>
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
            className={`mt-6 md:mt-8 px-8 py-3 rounded-full bg-[#c5c4c4] text-black font-semibold transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#b0afaf]"
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
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
