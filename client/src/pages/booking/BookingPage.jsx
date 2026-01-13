import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";

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

  // Fetch user's favorites and auto-fill name on mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("user") || "{}");

        if (!token || !userData._id) {
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
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/users/${userData._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

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
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to make a booking");
        setLoading(false);
        return;
      }

      // Find selected model details
      const selectedModelData = favorites.find(
        (fav) => fav.modelId === formData.selectedModel
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

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookingData),
        }
      );

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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Header */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4 md:p-8 animate-fade-in">
        <div
          className="w-full max-w-6xl rounded-3xl p-6 md:p-10 lg:p-12 flex flex-col lg:flex-row gap-8 md:gap-10 lg:gap-12 items-center animate-fade-in-up"
          style={{ backgroundColor: "#4e4847" }}
        >
          {/* Left Side - Text Content */}
          <div className="w-full lg:w-1/2 space-y-6 md:space-y-8">
            <p
              className="text-xs md:text-sm uppercase tracking-[0.2em] font-semibold"
              style={{ color: themeColor }}
            >
              WE'RE HERE TO ELEVATE YOUR EXPERIENCE
            </p>

            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="italic bg-gradient-to-r from-gold-light to-gold bg-clip-text text-transparent">
                Discuss
              </span>{" "}
              <span className="text-white">Your Needs.</span>
            </h2>

            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              Looking for professional PR models tailored to your brand, event,
              or campaign?
            </p>

            <p
              className="text-base md:text-lg leading-relaxed font-light"
              style={{ color: themeColor }}
            >
              Reach out to Power Allure and let us deliver elegance, discretion,
              and excellence.
            </p>
          </div>

          {/* Right Side - Form */}
          <div className="w-full lg:w-1/2">
            <div
              className="rounded-3xl p-6 md:p-8 shadow-lg"
              style={{ backgroundColor: themeColor }}
            >
              {/* Success Message */}
              {success && (
                <div className="mb-4 p-3 bg-green-500 text-white rounded-lg text-center">
                  ✓ Booking request submitted successfully!
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-500 text-white rounded-lg text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name is auto-filled in background from user account - not shown to user */}

                {/* Company Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="TDT Powerseed"
                    className="w-full px-4 py-3 rounded-full bg-[#c9a876] border-none focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-700 placeholder-gray-600"
                    required
                  />
                </div>

                {/* Event Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event
                  </label>
                  <input
                    type="text"
                    name="event"
                    value={formData.event}
                    onChange={handleInputChange}
                    placeholder="Event"
                    className="w-full px-4 py-3 rounded-full bg-[#c9a876] border-none focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-700 placeholder-gray-600"
                    required
                  />
                </div>

                {/* Event Date Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-full bg-[#c9a876] border-none focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-700 placeholder-gray-600"
                    required
                  />
                </div>

                {/* Event Time Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Time
                  </label>
                  <input
                    type="time"
                    name="eventTime"
                    value={formData.eventTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-full bg-[#c9a876] border-none focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-700 placeholder-gray-600"
                    required
                  />
                </div>

                {/* Model Selection Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Model (From Your Favorites)
                  </label>
                  <select
                    name="selectedModel"
                    value={formData.selectedModel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-full bg-[#c9a876] border-none focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-700"
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
                    className="bg-[#4e4847] text-white px-10 py-3 rounded-full font-semibold hover:bg-[#3a3534] transition-colors duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Submitting..." : "Book Now"}
                  </button>
                </div>

                {favorites.length === 0 && (
                  <p className="text-center text-sm text-gray-600 italic">
                    Please add models to your favorites before booking.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
