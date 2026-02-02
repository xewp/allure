import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API_URL from "../../config/api";

const Header = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

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
      const userId = user.id || user._id;
      const response = await fetch(`${API_URL}/api/users/${userId}/favorites`);

      if (response.ok) {
        const favorites = await response.json();
        const validFavorites = favorites.filter(
          (fav) => fav._id && fav._id !== "undefined",
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

      navigate("/booking");
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    if (location.pathname !== "/main") {
      navigate("/main", { state: { activeTab: tab } });
    } else if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-black border-b border-[#D8AF7F]/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo/Brand */}
            <Link
              to="/main"
              className="font-serif text-2xl md:text-3xl font-bold text-[#D8AF7F] hover:text-[#E8BF8F] transition-colors duration-300"
            >
              Power Allure
            </Link>

            {/* Desktop Navigation */}
            <nav className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() =>
                  navigate("/main", { state: { activeTab: "FAVORITES" } })
                }
                className="px-4 md:px-5 py-2 border-2 border-[#D8AF7F] text-[#D8AF7F] rounded-md font-medium uppercase text-xs md:text-sm tracking-wider hover:bg-[#D8AF7F] hover:text-black transition-all duration-300"
              >
                FAVORITES
              </button>
              <button
                onClick={handleBookingClick}
                disabled={loading}
                className="px-4 md:px-5 py-2 border-2 border-[#D8AF7F] text-[#D8AF7F] rounded-md font-medium uppercase text-xs md:text-sm tracking-wider hover:bg-[#D8AF7F] hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "..." : "BOOKING"}
              </button>
              <Link
                to="/profile"
                className="px-4 md:px-5 py-2 border-2 border-[#D8AF7F] text-[#D8AF7F] rounded-md font-medium uppercase text-xs md:text-sm tracking-wider hover:bg-[#D8AF7F] hover:text-black transition-all duration-300"
              >
                PROFILE
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Custom Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in-slow">
          <div className="bg-gray-900 border border-[#D8AF7F]/20 p-8 rounded-2xl max-w-md w-full text-center shadow-lg">
            <div className="w-16 h-16 bg-[#D8AF7F]/10 border border-[#D8AF7F]/20 rounded-full flex items-center justify-center mx-auto mb-6">
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

            <h3 className="text-2xl font-bold text-[#D8AF7F] font-serif mb-3">
              Action Required
            </h3>

            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              You need to select a model to book. Please check our models and
              add one to your <span className="text-[#D8AF7F]">Favorites</span>{" "}
              list first.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  if (location.pathname !== "/main") navigate("/main");
                }}
                className="px-8 py-3 bg-[#D8AF7F] text-black font-semibold text-base rounded-md hover:bg-[#C9A87C] transition-all duration-300"
              >
                Browse Models
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-8 py-3 border-2 border-gray-600 text-gray-300 font-semibold rounded-md hover:bg-gray-800 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
