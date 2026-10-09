import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
// Public pages
import LandingPage from "./pages/public/LandingPage";
import AboutPage from "./pages/public/AboutPage";
import ErrorPage from "./pages/public/ErrorPage";
import MaintenancePage from "./pages/public/MaintenancePage";
// Auth pages
import AuthPage from "./pages/auth/AuthPage";
import OTPVerificationPage from "./pages/auth/OTPVerificationPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
// Model pages
import MainPage from "./pages/models/MainPage";
import DetailPage from "./pages/models/DetailPage";
import FavoritesPage from "./pages/models/FavoritesPage";
// Booking pages
import BookingPage from "./pages/booking/BookingPage";
// User pages
import ProfilePage from "./pages/user/ProfilePage";
import EditPage from "./pages/user/EditPage";
// Common components
import ProtectedRoute from "./components/common/ProtectedRoute";
import "./App.css";

function App() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (maintenanceMode) {
      document.title = "We’ll Be Right Back — VELORA";
      return;
    }

    const titles = {
      "/": "VELORA — Talent & Events",
      "/about": "Our Story — VELORA",
      "/login": "Sign In — VELORA",
      "/register": "Create Account — VELORA",
      "/verify-otp": "Verify Email — VELORA",
      "/reset-password": "Reset Password — VELORA",
      "/main": "Discover Talent — VELORA",
      "/favorites": "Favorites — VELORA",
      "/booking": "Bookings — VELORA",
      "/profile": "Your Profile — VELORA",
      "/edit": "Edit Profile — VELORA",
    };

    document.title = location.pathname.startsWith("/model/")
      ? "Talent Profile — VELORA"
      : titles[location.pathname] || "VELORA — Talent & Events";
  }, [location.pathname, maintenanceMode]);

  useEffect(() => {
    // Set up a global fetch interceptor to detect maintenance mode
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      // Clone response to read body without consuming it
      const clonedResponse = response.clone();

      try {
        const data = await clonedResponse.json();
        if (data.maintenanceMode === true && response.status === 503) {
          setMaintenanceMode(true);
        }
      } catch {
        // Response is not JSON, ignore
      }

      return response;
    };

    return () => {
      // Cleanup: restore original fetch
      window.fetch = originalFetch;
    };
  }, []);

  // Show maintenance page if maintenance mode is detected
  if (maintenanceMode) {
    return <MaintenancePage />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/verify-otp" element={<OTPVerificationPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/main" element={<MainPage />} />
        <Route path="/model/:name" element={<DetailPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit" element={<EditPage />} />
      </Route>

      {/* Catch-all route for 404 errors - must be last */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
