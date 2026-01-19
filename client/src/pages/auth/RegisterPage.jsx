import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import RegisterForm from "../../components/auth/RegisterForm";
import API_URL from "../../config/api";

const RegisterPage = () => {
  const [signupEnabled, setSignupEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  // Check if signup is enabled
  useEffect(() => {
    const checkSignupStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/api/settings/public-settings`);
        const data = await response.json();
        if (data.success) {
          setSignupEnabled(data.settings.signupEnabled);
        }
      } catch (err) {
        console.error("Failed to check signup status:", err);
        // Default to enabled if check fails
      } finally {
        setLoading(false);
      }
    };
    checkSignupStatus();
  }, []);

  // Custom styling for register page - centered branding
  const registerLeftStyle = {
    justifyContent: "justify-center",
    paddingX: "pl-8 md:pl-16",
    marginLeft: "",
    headingSize: "text-5xl md:text-6xl",
    subheadingSize: "text-lg md:text-xl",
  };

  // If signup is disabled, show message instead of form
  if (loading) {
    return (
      <AuthLayout title="Register" leftSectionStyle={registerLeftStyle}>
        <div className="w-full max-w-lg flex flex-col items-center gap-4">
          <p className="text-black text-lg">Loading...</p>
        </div>
      </AuthLayout>
    );
  }

  if (!signupEnabled) {
    return (
      <AuthLayout title="Register" leftSectionStyle={registerLeftStyle}>
        <div className="w-full max-w-lg flex flex-col items-center gap-6 text-center">
          <div className="bg-red-100 border-2 border-red-400 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-red-700 mb-3">
              Registrations Currently Disabled
            </h2>
            <p className="text-red-600 mb-4">
              New user registrations are temporarily unavailable. Please contact
              support for assistance.
            </p>
          </div>
          <Link
            to="/login"
            className="px-8 py-3 rounded-full bg-black text-gold font-semibold transition-all hover:scale-105 hover:shadow-gold"
          >
            Go to Login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Register" leftSectionStyle={registerLeftStyle}>
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
