import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import RegisterForm from "../../components/auth/RegisterForm";
import API_URL from "../../config/api";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [signupEnabled, setSignupEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  // Check if signup is enabled
  useEffect(() => {
    const checkSignupStatus = async () => {
      try {
        console.log("[RegisterPage] Checking signup status...");
        const response = await fetch(`${API_URL}/api/settings/public-settings`);
        const data = await response.json();
        console.log("[RegisterPage] API Response:", data);

        if (data.success) {
          const isEnabled = data.settings.signupEnabled;
          console.log("[RegisterPage] Signup enabled:", isEnabled);
          setSignupEnabled(isEnabled);
        }
      } catch (err) {
        console.error("Failed to check signup status:", err);
        // Default to enabled if check fails
      } finally {
        setLoading(false);
      }
    };
    checkSignupStatus();
  }, [navigate]);

  // Custom styling for register page - centered branding
  const registerLeftStyle = {
    justifyContent: "justify-center",
    paddingX: "pl-8 md:pl-16",
    marginLeft: "",
    headingSize: "text-5xl md:text-6xl",
    subheadingSize: "text-lg md:text-xl",
  };

  // If still loading, show loading state
  if (loading) {
    return (
      <AuthLayout title="Register" leftSectionStyle={registerLeftStyle}>
        <div className="w-full max-w-lg flex flex-col items-center gap-4">
          <p className="text-black text-lg">Loading...</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Register" leftSectionStyle={registerLeftStyle}>
      <RegisterForm signupEnabled={signupEnabled} />
    </AuthLayout>
  );
};

export default RegisterPage;
