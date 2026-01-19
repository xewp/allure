import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import EditProfileModal from "../../components/profile/EditProfileModal";
import OTPModal from "../../components/auth/OTPModal";
import API_URL from "../../config/api";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);

  // Fetch user data from MongoDB
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

        // Support both old (_id) and new (id) user object formats
        const userId = storedUser.id || storedUser._id;

        if (!userId) {
          throw new Error("User ID not found");
        }

        const response = await fetch(`${API_URL}/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser(data.user);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message || "Failed to load profile data");
        setLoading(false);
      }
    };

    fetchUserData();
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleUpdateSuccess = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleVerifyEmail = () => {
    setShowOTPModal(true);
  };

  const handleOTPSuccess = async () => {
    setShowOTPModal(false);
    // Refresh user data to show updated verification status
    try {
      const token = localStorage.getItem("token");
      const userId = user._id;
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data.user);
      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));
      storedUser.emailVerified = true;
      localStorage.setItem("user", JSON.stringify(storedUser));
    } catch (err) {
      console.error("Failed to refresh user data", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col">
        <Header activeTab="PROFILE" />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-400 mb-2">
              Error Loading Profile
            </h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => navigate("/main")}
              className="px-8 py-3 bg-gold text-black font-semibold rounded-full hover:scale-105 transition-all duration-300"
            >
              Go to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col font-sans relative overflow-hidden transition-opacity duration-500 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-gold/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-gold/10 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <Header activeTab="PROFILE" />

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-5xl bg-charcoal/60 backdrop-blur-xl rounded-3xl border border-gold/20 shadow-gold-lg p-8 md:p-12 lg:p-16 animate-fade-in-slow hover:border-gold/40 transition-all duration-500">
          {/* Profile Header Section */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gold/30 shadow-gold-lg overflow-hidden mx-auto hover:border-gold/60 hover:shadow-gold transition-all duration-500 group bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                <span className="text-6xl md:text-7xl font-bold text-gold">
                  {user?.firstName?.charAt(0).toUpperCase()}
                  {user?.lastName?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-3 bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent animate-title-entrance leading-tight">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-lg md:text-xl text-gray-300/80 font-light tracking-wide">
              Welcome to your personal dashboard
            </p>
          </div>

          {/* Profile Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Email */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-gold/10 hover:border-gold/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                  <span className="text-gold text-xl">✉</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Email Address
                </h3>
              </div>
              <p className="text-lg text-white font-medium pl-13">
                {user?.email}
              </p>
            </div>

            {/* Phone Number */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-gold/10 hover:border-gold/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                  <span className="text-gold text-xl">📱</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Phone Number
                </h3>
              </div>
              <p className="text-lg text-white font-medium pl-13">
                {user?.phoneNumber}
              </p>
            </div>

            {/* Age */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-gold/10 hover:border-gold/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                  <span className="text-gold text-xl">🎂</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Age
                </h3>
              </div>
              <p className="text-lg text-white font-medium pl-13">
                {user?.age} years old
              </p>
            </div>

            {/* Member Since */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-gold/10 hover:border-gold/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                  <span className="text-gold text-xl">📅</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Member Since
                </h3>
              </div>
              <p className="text-lg text-white font-medium pl-13">
                {new Date(user?.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-6 border-t border-gold/20">
            <button
              onClick={() => navigate("/main")}
              className="group relative px-8 py-3 bg-gold text-black font-semibold text-base rounded-full overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-gold-lg"
            >
              <span className="relative z-10">Home</span>
              <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
            <button
              onClick={handleEditProfile}
              className="px-8 py-3 border-2 border-gold/50 text-gold font-semibold text-base rounded-full hover:bg-gold/10 hover:border-gold transition-all duration-300"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-8 py-3 border-2 border-gray-500/30 text-gray-300 font-semibold text-base rounded-full hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </main>

      <Footer />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        userData={user}
        onUpdateSuccess={handleUpdateSuccess}
      />

      {/* OTP Verification Modal */}
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={user?.email}
        onSuccess={handleOTPSuccess}
        onVerifyLater={() => setShowOTPModal(false)}
      />
    </div>
  );
};

export default ProfilePage;
