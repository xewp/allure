import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API_URL from "../config/api";

const Header = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Theme colors extracted from image
  const goldColor = "text-[#D8AF7F]"; // The text color
  const goldBg = "bg-[#D8AF7F]"; // The search bar background
  const navBarBg = "bg-[#4F4949]"; // The dark brown/grey pill background

  const handleTabClick = (tab) => {
    // If we're not on the main page, navigate to it with the selected tab
    if (location.pathname !== "/main") {
      navigate("/main", { state: { activeTab: tab } });
    } else if (onTabChange) {
      // If we're already on main page, just update the tab
      onTabChange(tab);
    }
  };

  const handleBookingClick = async () => {
    if (location.pathname === "/booking") return;

    try {
      setLoading(true);
      const userStr = localStorage.getItem("user");

      // If not logged in, let them go to booking (protected route will handle it)
      if (!userStr) {
        navigate("/booking");
        return;
      }

      const user = JSON.parse(userStr);
      const response = await fetch(
        `${API_URL}/api/users/${user._id}/favorites`
      );

      if (response.ok) {
        const favorites = await response.json();
        const validFavorites = favorites.filter(
          (fav) => fav._id && fav._id !== "undefined"
        );

        if (validFavorites.length === 0) {
          setShowModal(true);
        } else {
          navigate("/booking");
        }
      } else {
        // Fallback if fetch fails
        navigate("/booking");
      }
    } catch (error) {

      navigate("/booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Outer Container (Black Background)
    <div className="w-full bg-black flex justify-center relative">
      {/* Inner "Pill" Navbar */}
      <div
        className={`${navBarBg} w-full rounded-lg h-20 flex items-center justify-between px-4 shadow-lg`}
      >
        {/* --- LEFT SECTION: Local/Foreign/Favorites --- */}
        <div className="flex-1 flex items-center gap-4 text-sm font-medium">
          <span
            onClick={() => handleTabClick("LOCAL")}
            className="cursor-pointer hover:text-white transition-colors text-2xl"
            style={{ color: activeTab === "LOCAL" ? "#dcb886" : "#d1d5db" }}
          >
            Local
          </span>
          <span
            onClick={() => handleTabClick("FOREIGN")}
            className="cursor-pointer hover:text-white transition-colors text-2xl"
            style={{ color: activeTab === "FOREIGN" ? "#dcb886" : "#d1d5db" }}
          >
            Foreign
          </span>
        </div>

        {/* --- CENTER SECTION: Logo --- */}
        <div className="flex-1 flex justify-center">
          <h1
            className={`${goldColor} text-4xl font-bold tracking-wide whitespace-nowrap`}
          >
            Power Allure
          </h1>
        </div>

        {/* --- RIGHT SECTION: Search & Nav --- */}
        <div className="flex-1 flex items-center justify-end gap-5">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className={`${goldBg} text-black placeholder-black/70 text-xs font-medium rounded-full py-1.5 pl-3 pr-8 w-42 md:w-52 focus:outline-none focus:ring-1 focus:ring-white transition-all`}
            />
            {/* Search Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w- absolute right-3 top-1/2 transform -translate-y-1/2 text-black/80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Right Links */}

          <nav className="flex items-center gap-5">
            <span
              onClick={() => handleTabClick("FAVORITES")}
              className="cursor-pointer hover:text-white transition-colors text-2xl"
              style={{
                color: activeTab === "FAVORITES" ? "#dcb886" : "#d1d5db",
              }}
            >
              Favorites
            </span>
            <span
              onClick={handleBookingClick}
              className={`cursor-pointer hover:text-white transition-colors text-2xl ${
                loading ? "opacity-50 cursor-wait" : ""
              }`}
              style={{
                color: location.pathname === "/booking" ? "#dcb886" : "#d1d5db",
              }}
            >
              Booking
            </span>
            <span
              onClick={() => navigate("/profile")}
              className="cursor-pointer hover:text-white transition-colors text-2xl"
              style={{ color: activeTab === "PROFILE" ? "#dcb886" : "#d1d5db" }}
            >
              Profile
            </span>
          </nav>
        </div>
      </div>

      {/* Custom Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-[#1a1a1a] border border-[#D8AF7F] p-8 rounded-2xl max-w-md w-full text-center relative shadow-2xl transform transition-all scale-100 animate-fade-in-up">
            <div className="w-16 h-16 bg-[#D8AF7F]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#D8AF7F]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h3 className="text-2xl font-bold text-[#D8AF7F] mb-3">
              Action Required
            </h3>

            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              You need to select a model to book. Please check our models and
              add one to your{" "}
              <span className="text-[#D8AF7F] font-semibold">Favorites</span>{" "}
              list first.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  if (location.pathname !== "/main") navigate("/main");
                }}
                className="bg-[#D8AF7F] text-black font-bold py-3 px-8 rounded-full hover:bg-white hover:scale-105 transition-all shadow-lg shadow-[#D8AF7F]/20"
              >
                Browse Models
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="border border-gray-600 text-gray-400 font-bold py-3 px-8 rounded-full hover:border-white hover:text-white transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
