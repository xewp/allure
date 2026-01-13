import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API_URL from "../../config/api";

const Header = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTabClick = (tab) => {
    if (location.pathname !== "/main") {
      navigate("/main", { state: { activeTab: tab } });
    } else if (onTabChange) {
      onTabChange(tab);
    }
  };

  const handleBookingClick = async () => {
    if (location.pathname === "/booking") return;

    try {
      setLoading(true);
      const userStr = localStorage.getItem("user");

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
        navigate("/booking");
      }
    } catch (error) {
      console.error("Error checking favorites:", error);
      navigate("/booking");
    } finally {
      setLoading(false);
    }
  };

  const NavButton = ({ tab, children }) => {
    const isActive =
      tab.toLowerCase() === activeTab?.toLowerCase() ||
      location.pathname === `/${tab.toLowerCase()}`;

    return (
      <button
        onClick={() => handleTabClick(tab)}
        disabled={loading && tab === "BOOKING"}
        className={`relative text-lg font-semibold uppercase tracking-wider transition-colors duration-300 group pb-2 ${
          isActive ? "text-gold" : "text-white hover:text-gold"
        } ${loading && tab === "BOOKING" ? "opacity-50 cursor-wait" : ""}`}
      >
        {children}
        <span
          className={`absolute bottom-0 left-0 h-0.5 bg-gold transition-all duration-300 ${
            isActive ? "w-full" : "w-0 group-hover:w-full"
          }`}
        ></span>
      </button>
    );
  };

  return (
    <div className="w-full flex justify-center sticky top-0 z-40">
      <div className="w-full max-w-7xl bg-charcoal/50 backdrop-blur-lg rounded-xl h-20 flex items-center justify-between px-6 my-2 border-b border-white/10">
        {/* --- LEFT SECTION: Navigation --- */}
        <div className="flex-1 flex items-center gap-8 text-sm font-medium">
          <NavButton tab="LOCAL">Local</NavButton>
          <NavButton tab="FOREIGN">Foreign</NavButton>
        </div>

        {/* --- CENTER SECTION: Logo --- */}
        <div className="flex-1 flex justify-center">
          <h1 className="font-serif text-4xl font-bold bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent whitespace-nowrap">
            Power Allure
          </h1>
        </div>

        {/* --- RIGHT SECTION: Navigation & Search --- */}
        <div className="flex-1 flex items-center justify-end gap-8">
          <NavButton tab="FAVORITES">Favorites</NavButton>

          {/* Booking Button with dedicated handler */}
          <button
            onClick={handleBookingClick}
            disabled={loading}
            className={`relative text-lg font-semibold uppercase tracking-wider transition-colors duration-300 group pb-2 ${
              location.pathname === "/booking"
                ? "text-gold"
                : "text-white hover:text-gold"
            } ${loading ? "opacity-50 cursor-wait" : ""}`}
          >
            Booking
            <span
              className={`absolute bottom-0 left-0 h-0.5 bg-gold transition-all duration-300 ${
                location.pathname === "/booking"
                  ? "w-full"
                  : "w-0 group-hover:w-full"
              }`}
            ></span>
          </button>

          {/* Profile Button with direct navigation */}
          <button
            onClick={() => navigate("/profile")}
            className={`relative text-lg font-semibold uppercase tracking-wider transition-colors duration-300 group pb-2 ${
              location.pathname === "/profile"
                ? "text-gold"
                : "text-white hover:text-gold"
            }`}
          >
            Profile
            <span
              className={`absolute bottom-0 left-0 h-0.5 bg-gold transition-all duration-300 ${
                location.pathname === "/profile"
                  ? "w-full"
                  : "w-0 group-hover:w-full"
              }`}
            ></span>
          </button>
        </div>
      </div>

      {/* Custom Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in-slow">
          <div className="bg-charcoal border border-gold/20 p-8 rounded-2xl max-w-md w-full text-center shadow-gold-lg animate-slide-up">
            <div className="w-16 h-16 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gold"
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

            <h3 className="text-2xl font-bold text-gold font-serif mb-3">
              Action Required
            </h3>

            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              You need to select a model to book. Please check our models and
              add one to your <span className="text-gold">Favorites</span> list
              first.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  if (location.pathname !== "/main") navigate("/main");
                }}
                className="group relative inline-flex items-center gap-3 px-8 py-3 bg-gold text-black font-semibold text-base rounded-full overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-gold"
              >
                Browse Models
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-8 py-3 border-2 border-warm-gray text-gray-300 font-semibold rounded-full hover:bg-warm-gray hover:text-white transition-all duration-300"
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
