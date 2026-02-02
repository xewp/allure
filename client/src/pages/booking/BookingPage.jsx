import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import API_URL from "../../config/api";

const BookingPage = () => {
  const themeColor = "#dcb887";
  const [activeTab, setActiveTab] = useState("LOCAL");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    event: "",
    eventDate: "",
    eventTime: "",
    selectedModel: "",
  });

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Fetch user's favorites and auto-fill name on mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = userData.id || userData._id;

        if (!token || !userId) {
          setError("Please log in to make a booking");
          return;
        }

        // Auto-fill user's full name
        const fullName = `${userData.firstName || ""} ${
          userData.lastName || ""
        }`.trim();
        if (fullName) {
          setFormData((prev) => ({
            ...prev,
            name: fullName,
          }));
        }

        // Get favorites from localStorage user data
        if (userData.favorites && userData.favorites.length > 0) {
          setFavorites(userData.favorites);
        } else {
          // Fetch fresh user data to get favorites
          const userId = userData.id || userData._id;
          const response = await fetch(`${API_URL}/api/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.user.favorites) {
              setFavorites(data.user.favorites);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };

    fetchFavorites();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Basic validation - company is now optional
    if (
      !formData.event ||
      !formData.eventDate ||
      !formData.eventTime ||
      !formData.selectedModel
    ) {
      setError("Please provide all required fields");
      return;
    }

    // Show confirmation modal instead of submitting directly
    setShowConfirmation(true);
  };

  const handleConfirmBooking = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to make a booking");
        setLoading(false);
        return;
      }

      // Find selected model details
      const selectedModelData = favorites.find(
        (fav) => fav.modelId === formData.selectedModel,
      );

      if (!selectedModelData) {
        setError("Please select a model from your favorites");
        setLoading(false);
        return;
      }

      const bookingData = {
        userName: formData.name,
        company: formData.company,
        event: formData.event,
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        modelId: selectedModelData.modelId,
        modelName: selectedModelData.name,
        modelCategory: selectedModelData.category?.toLowerCase() || "local",
      };

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setFormData({
          name: "",
          company: "",
          event: "",
          eventDate: "",
          eventTime: "",
          selectedModel: "",
        });

        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        setError(data.message || "Failed to create booking");
      }
    } catch (err) {
      console.error("Booking submission error:", err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
      setShowConfirmation(false);
    }
  };

  // Get selected model details for confirmation
  const selectedModelData = favorites.find(
    (fav) =>
      fav.modelId === formData.selectedModel ||
      fav._id === formData.selectedModel,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Header */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4 md:p-8 animate-fade-in">
        <div className="w-full max-w-6xl rounded-3xl p-6 md:p-10 lg:p-12 flex flex-col lg:flex-row gap-8 md:gap-10 lg:gap-12 items-center animate-fade-in-up bg-black border-2 border-[#D8AF7F]/30">
          {/* Left Side - Text Content */}
          <div className="w-full lg:w-1/2 space-y-6 md:space-y-8">
            <p className="text-xs md:text-sm uppercase tracking-[0.2em] font-semibold text-[#D8AF7F]">
              WE'RE HERE TO ELEVATE YOUR EXPERIENCE
            </p>

            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="italic text-[#D8AF7F]">Discuss</span>{" "}
              <span className="text-white">Your Needs.</span>
            </h2>

            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              Looking for professional PR models tailored to your brand, event,
              or campaign?
            </p>

            <p className="text-[#D8AF7F] text-base md:text-lg leading-relaxed font-light">
              Reach out to Power Allure and let us deliver elegance, discretion,
              and excellence.
            </p>
          </div>

          {/* Right Side - Form */}
          <div className="w-full lg:w-1/2">
            <div className="rounded-3xl p-6 md:p-8 shadow-lg bg-gradient-to-b from-[#3a3a3a] via-[#5a5a5a] to-[#D8AF7F]">
              {/* Success Message */}
              {success && (
                <div className="mb-4 p-3 bg-green-500 text-white rounded-lg text-center">
                  ✓ Booking request submitted successfully!
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-200 rounded-lg text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name is auto-filled in background from user account - not shown to user */}

                {/* Company Field */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Company name (optional)"
                    className="w-full px-4 py-3 md:py-4 rounded-lg bg-[#D8AF7F] placeholder-black/70 text-black text-base focus:outline-none focus:ring-2 focus:ring-[#C9A87C] transition-all"
                  />
                </div>

                {/* Event Field */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Event *
                  </label>
                  <input
                    type="text"
                    name="event"
                    value={formData.event}
                    onChange={handleInputChange}
                    placeholder="Event name or type"
                    className="w-full px-4 py-3 md:py-4 rounded-lg bg-[#D8AF7F] placeholder-black/70 text-black text-base focus:outline-none focus:ring-2 focus:ring-[#C9A87C] transition-all"
                    required
                  />
                </div>

                {/* Event Date Field */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 md:py-4 rounded-lg bg-[#D8AF7F] text-black text-base focus:outline-none focus:ring-2 focus:ring-[#C9A87C] transition-all"
                    required
                  />
                </div>

                {/* Event Time Field */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Event Time *
                  </label>
                  <input
                    type="time"
                    name="eventTime"
                    value={formData.eventTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 md:py-4 rounded-lg bg-[#D8AF7F] text-black text-base focus:outline-none focus:ring-2 focus:ring-[#C9A87C] transition-all"
                    required
                  />
                </div>

                {/* Model Selection Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Select Model (From Your Favorites) *
                  </label>
                  <select
                    name="selectedModel"
                    value={formData.selectedModel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 md:py-4 rounded-lg bg-[#D8AF7F] text-black text-base focus:outline-none focus:ring-2 focus:ring-[#C9A87C] transition-all"
                    required
                  >
                    <option value="">-- Choose a model --</option>
                    {favorites.length === 0 ? (
                      <option value="" disabled>
                        No favorites yet. Add models to favorites first.
                      </option>
                    ) : (
                      favorites.map((fav) => (
                        <option key={fav.modelId} value={fav.modelId}>
                          {fav.name} ({fav.category || "Local"})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    disabled={loading || favorites.length === 0}
                    className="px-8 md:px-10 py-2 md:py-3 text-base md:text-lg rounded-md bg-[#D8AF7F] text-black font-normal transition-all hover:bg-[#C9A87C] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Submitting..." : "Book Now"}
                  </button>
                </div>

                {favorites.length === 0 && (
                  <p className="text-center text-sm text-white/80 italic">
                    Please add models to your favorites before booking.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && selectedModelData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowConfirmation(false)}
        >
          <div
            className="relative w-full max-w-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl border-2 border-gold/40 shadow-2xl overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-gold/30 bg-gradient-to-r from-gold/10 to-transparent">
              <h2 className="font-serif text-3xl md:text-4xl font-bold bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
                Confirm Your Booking
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                Please review your booking details before confirming
              </p>
            </div>

            {/* Content */}
            <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">
              {/* Model Section */}
              <div className="mb-6">
                <h3 className="text-gold font-semibold mb-3 text-lg">
                  Model Information
                </h3>
                <div className="flex gap-4 items-start bg-black/30 p-4 rounded-xl border border-gold/20">
                  {/* Model Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={selectedModelData.imageUrl}
                      alt={selectedModelData.name}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover border-2 border-gold/40 shadow-lg"
                    />
                  </div>
                  {/* Model Details */}
                  <div className="flex-1">
                    <p className="text-2xl font-bold text-gold">
                      {selectedModelData.name}
                    </p>
                    <p className="text-gray-300 capitalize mt-1">
                      {selectedModelData.category || "Local"} Model
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Details Section */}
              <div className="mb-6">
                <h3 className="text-gold font-semibold mb-3 text-lg">
                  Event Details
                </h3>
                <div className="bg-black/30 p-4 rounded-xl border border-gold/20 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Company:</span>
                    <span className="text-white font-semibold">
                      {formData.company}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Event:</span>
                    <span className="text-white font-semibold">
                      {formData.event}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date:</span>
                    <span className="text-white font-semibold">
                      {new Date(formData.eventDate).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time:</span>
                    <span className="text-white font-semibold">
                      {formData.eventTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="mb-6 p-4 bg-gold/10 border border-gold/30 rounded-xl">
                <p className="text-gold-light text-sm">
                  <span className="font-bold">⚠ Note:</span> Please double-check
                  all details above. Your booking will be submitted for admin
                  approval.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-500/30 text-gray-300 font-semibold rounded-xl hover:bg-gray-500/10 hover:border-gray-400/50 transition-all duration-300"
                >
                  Go Back & Edit
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-gold-light via-gold to-gold-dark text-black font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
