import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import API_URL from "../../config/api";

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const validateSession = async () => {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");
      const userString = sessionStorage.getItem("user") || localStorage.getItem("user");

      // If no token or user, redirect to login
      if (!token || !userString) {
        setIsValid(false);
        setLoading(false);
        return;
      }

      // Validate that user data is valid JSON
      try {
        const user = JSON.parse(userString);

        if (!user || typeof user !== "object") {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsValid(false);
          setLoading(false);
          return;
        }
      } catch {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsValid(false);
        setLoading(false);
        return;
      }

      // Validate session with backend
      try {
        const response = await fetch(`${API_URL}/auth/validate-session`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.success && !data.sessionInvalidated) {
          // Session is valid
          setIsValid(true);
        } else {
          // Session has been invalidated
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsValid(false);
        }
      } catch {
        // On network error, clear session for security
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsValid(false);
      }

      setLoading(false);
    };

    validateSession();
  }, []);

  // Show loading state while validating
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-obsidian px-4 text-porcelain">
        <div className="text-center" role="status" aria-live="polite">
          <div className="mx-auto flex h-12 w-12 items-center justify-center border border-brass/60 font-serif text-xl text-brass">
            V
          </div>
          <div className="mx-auto mt-5 h-px w-20 overflow-hidden bg-porcelain/10">
            <div className="h-full w-1/2 animate-pulse bg-oxblood" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-taupe">
            Preparing your collection
          </p>
        </div>
      </div>
    );
  }

  // If session is not valid, redirect to login
  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated and valid, render the protected pages
  return <Outlet />;
};

export default ProtectedRoute;
