import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0A0A0A] font-sans">
      <div className="w-full max-w-md mx-4 px-6 py-12 md:px-10 bg-[#1A1A1A] shadow-2xl rounded-2xl border border-[#2A2A2A] flex flex-col">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-[#D8AF7F] font-serif mb-2">
            Power Allure
          </h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            Admin Portal
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="relative">
            <label className="block text-xs font-bold text-[#D8AF7F] uppercase tracking-wider mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pb-2 border-b-2 border-gray-600 bg-transparent text-white text-base focus:border-[#D8AF7F] focus:outline-none transition-colors placeholder-gray-600"
              placeholder="Enter your username"
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-bold text-[#D8AF7F] uppercase tracking-wider mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                className="w-full pb-2 border-b-2 border-gray-600 bg-transparent text-white text-base focus:border-[#D8AF7F] focus:outline-none transition-colors pr-10 placeholder-gray-600"
                placeholder="Enter your password"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 text-gray-500 hover:text-[#D8AF7F] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-950/50 p-3 rounded-md text-sm font-medium border border-red-900/50">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`mt-6 w-full py-4 rounded-full bg-[#D8AF7F] text-black font-bold text-sm uppercase tracking-widest transition-all duration-300 ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#C9A87C] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            }`}
          >
            {loading ? "Authenticating..." : "Access Portal"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
