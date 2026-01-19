import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
// Public pages
import LandingPage from "./pages/public/LandingPage";
import AboutPage from "./pages/public/AboutPage";
import ErrorPage from "./pages/public/ErrorPage";
import MaintenancePage from "./pages/public/MaintenancePage";
// Auth pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
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
      } catch (e) {
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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
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
