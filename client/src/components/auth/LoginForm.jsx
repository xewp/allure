import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../config/api";

/**
 * LoginForm - Reusable login form component
 * Handles login state, validation, and API communication
 */
const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Clear any stale tokens when login form loads
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
      console.error("Login error:", err);
      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-sm md:w-96 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-4 md:p-5 rounded-xl bg-[#c5c4c4] placeholder-gray-600 text-black text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
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
          className="w-full p-4 md:p-5 rounded-xl bg-[#c5c4c4] placeholder-gray-600 text-black text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
        />
        {error && (
          <div className="text-red-600 text-sm font-semibold text-center bg-red-100 p-3 rounded-lg border border-red-300">
            {error}
          </div>
        )}
      </div>
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className={`mt-6 md:mt-8 px-10 md:px-12 py-3 md:py-4 text-lg md:text-xl rounded-full bg-black text-gold font-semibold transition-all hover:scale-105 ${
          isLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-gold"
        }`}
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </>
  );
};

export default LoginForm;
