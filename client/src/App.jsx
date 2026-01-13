import { Routes, Route } from "react-router-dom";
// Public pages
import LandingPage from "./pages/public/LandingPage";
import AboutPage from "./pages/public/AboutPage";
import ErrorPage from "./pages/public/ErrorPage";
// Auth pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
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
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

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
