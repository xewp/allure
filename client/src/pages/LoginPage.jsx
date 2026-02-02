import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Clear any stale tokens when login page loads
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const handleLogin = async () => {
    // Clear previous errors
    setError("");

    // Validate inputs
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Login successful
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/main");
      } else {
        // Login failed
        setError(data.message || "Invalid username or password");
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
        className={`hidden md:flex relative md:w-1/2 h-full bg-black flex-col justify-start pt-20 md:pt-32 md:-ml-36 z-10 transition-all duration-1000 ${
          visibleSections.has("left")
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-10"
        }`}
        style={{ clipPath: "polygon(0 0, 100% 0, 60% 100%, 0 100%)" }}
      >
        <h1 className="text-[#D8AF7F] text-[50px] md:text-[70px] font-bold mb-4 leading-tight px-4 md:px-0">
          Power Allure
        </h1>
        <p className="text-[#D8AF7F] text-xl md:text-2xl px-4 md:px-0">
          Feel the power. Own the allure.
        </p>
      </div>

      {/* Right Section with Tan Background and Login Form */}
      <div className="w-full md:w-auto md:absolute md:inset-0 flex md:justify-end justify-center items-center z-0">
        <div
          data-section="right"
          className={`w-full md:w-1/2 flex flex-col items-center px-4 md:px-0 transition-all duration-1000 delay-300 ${
            visibleSections.has("right")
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-10"
          }`}
        >
          <h2 className="text-black text-3xl md:text-5xl font-bold mb-6 md:mb-8">
            Login
          </h2>
          <div className="w-full max-w-sm md:w-96 flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 md:p-5 rounded-xl bg-[#c5c4c4] placeholder-gray-600 text-black text-base md:text-lg focus:outline-none"
            />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
              className="w-full p-4 md:p-5 rounded-xl bg-[#c5c4c4] placeholder-gray-600 text-black text-base md:text-lg focus:outline-none"
            />
            {error && (
              <div className="text-red-600 text-sm font-semibold text-center bg-red-100 p-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`mt-6 md:mt-8 px-10 md:px-12 py-3 md:py-4 text-lg md:text-xl rounded-full bg-[#c5c4c4] text-black font-semibold transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#b0afaf]"
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
