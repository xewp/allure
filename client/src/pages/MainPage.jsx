import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import API_URL from "../config/api";

const MainPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize activeTab from location.state if available, otherwise default to LOCAL
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "LOCAL",
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [userPermissions, setUserPermissions] = useState(null); // Track user permissions
  const [permissionsLoading, setPermissionsLoading] = useState(true);

  const themeColor = "#D8AF7F"; // Gold
  const arrowBgColor = "#3e3e3e"; // Dark grey for carousel buttons

  // Fetch user permissions on mount
  useEffect(() => {
    const fetchUserPermissions = async () => {
      alert("DEBUG: Starting permission fetch"); // DEBUG
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = storedUser.id || storedUser._id;
        const token = localStorage.getItem("token");

        console.log(
          "DEBUG: userId=",
          userId,
          "token=",
          token ? "exists" : "missing",
        );

        if (!userId || !token) {
          alert("DEBUG: No userId or token found");
          setPermissionsLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("DEBUG: Response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched user permissions:", data.user);
          console.log("canViewModels value:", data.user.canViewModels);
          alert(`DEBUG: canViewModels = ${data.user.canViewModels}`); // DEBUG
          setUserPermissions({
            canViewModels: data.user.canViewModels !== false,
          });
        } else {
          console.error("Failed to fetch permissions:", response.status);
          alert(`DEBUG: API failed with status ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching user permissions:", error);
        alert(`DEBUG: Error - ${error.message}`);
      } finally {
        setPermissionsLoading(false);
      }
    };

    fetchUserPermissions();
  }, []);

  // Fetch models from API based on category
  const fetchModels = async (category) => {
    setLoading(true);

    // Fade out animation
    setVisibleSections((prev) => {
      const newSet = new Set(prev);
      newSet.delete("grid");
      return newSet;
    });

    // Wait for fade out
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const endpoint = category === "LOCAL" ? "local" : "foreign";
      const response = await fetch(
        `${API_URL}/models/${endpoint}?available=true`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setModels(data);

      // Fade in animation
      setTimeout(() => {
        setVisibleSections((prev) => new Set([...prev, "grid"]));
      }, 50);
    } catch (error) {
      console.error("Error fetching models:", error);
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch favorites from user's MongoDB collection
  const fetchFavorites = async () => {
    setLoading(true);

    // Fade out animation
    setVisibleSections((prev) => {
      const newSet = new Set(prev);
      newSet.delete("grid");
      return newSet;
    });

    // Wait for fade out
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        setModels([]);
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_URL}/api/users/${user._id}/favorites`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const favorites = await response.json();
      console.log(
        "Fetched favorites - RAW DATA:",
        JSON.stringify(favorites, null, 2),
      );

      // Filter out any favorites without a valid ID
      const validFavorites = favorites.filter((fav) => {
        const hasValidId = fav._id && fav._id !== "undefined";
        if (!hasValidId) {
          console.warn("Favorite missing valid _id:", fav);
        }
        return hasValidId;
      });

      console.log(
        "Valid favorites after filtering - COUNT:",
        validFavorites.length,
      );
      console.log(
        "Valid favorites - FULL DATA:",
        JSON.stringify(validFavorites, null, 2),
      );
      setModels(validFavorites);

      // Fade in animation
      setTimeout(() => {
        setVisibleSections((prev) => new Set([...prev, "grid"]));
      }, 50);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch randomized carousel models from both collections
  const fetchCarouselModels = async () => {
    try {
      const [localResponse, foreignResponse] = await Promise.all([
        fetch(`${API_URL}/models/local`),
        fetch(`${API_URL}/models/foreign`),
      ]);

      const localData = await localResponse.json();
      const foreignData = await foreignResponse.json();

      // Combine and shuffle
      const combined = [...localData, ...foreignData];
      const shuffled = combined.sort(() => Math.random() - 0.5);

      return shuffled;
    } catch (error) {
      console.error("Error fetching carousel models:", error);
      return [];
    }
  };

  // Separate state for carousel models (randomized from both collections)
  const [carouselModels, setCarouselModels] = useState([]);

  // Fetch carousel models on mount (randomized from both collections)
  useEffect(() => {
    const loadCarouselModels = async () => {
      const randomized = await fetchCarouselModels();
      setCarouselModels(randomized);
    };
    loadCarouselModels();
  }, []);

  // Fetch data when activeTab changes
  useEffect(() => {
    if (activeTab === "LOCAL" || activeTab === "FOREIGN") {
      fetchModels(activeTab);
    } else if (activeTab === "FAVORITES") {
      fetchFavorites();
    }
  }, [activeTab]);

  // Auto-play carousel (uses randomized carousel models)
  useEffect(() => {
    if (carouselModels.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === carouselModels.length - 1 ? 0 : prevIndex + 1,
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [carouselModels.length]);

  const handleCardClick = (model) => {
    // Convert model name to URL-friendly slug (lowercase, replace spaces with hyphens)
    const modelSlug = model.name.toLowerCase().replace(/\s+/g, "-");

    navigate(`/model/${modelSlug}`, {
      state: {
        selectedImage: model.imageUrl,
        category: activeTab,
        modelId: model._id, // Pass the actual ID through state (hidden from URL)
      },
    });
  };

  const handleCarouselClick = () => {
    if (carouselModels.length > 0) {
      handleCardClick(carouselModels[currentIndex]);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      {/* Header with Title and Navigation */}
      <header className="w-full bg-black py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Title - Luxury Serif Font */}
          <h1
            className="text-center mb-8"
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontSize: "clamp(3rem, 8vw, 5rem)",
              fontWeight: "700",
              color: themeColor,
              letterSpacing: "0.02em",
              textShadow: `0 2px 20px rgba(216, 175, 127, 0.3)`,
            }}
          >
            Power Allure
          </h1>

          {/* Navigation Buttons - Matching Header Design */}
          <nav className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
            {/* LOCAL Button */}
            <button
              onClick={() => handleTabClick("LOCAL")}
              className={`px-8 py-2 rounded-md font-medium uppercase tracking-wider text-sm transition-all duration-300 ${
                activeTab === "LOCAL"
                  ? "border-2 border-[#D8AF7F] text-[#D8AF7F] bg-transparent"
                  : "border-2 border-[#D8AF7F] bg-white text-black hover:bg-gray-100"
              }`}
            >
              LOCAL
            </button>

            {/* FOREIGN Button */}
            <button
              onClick={() => handleTabClick("FOREIGN")}
              className={`px-8 py-2 rounded-md font-medium uppercase tracking-wider text-sm transition-all duration-300 ${
                activeTab === "FOREIGN"
                  ? "border-2 border-[#D8AF7F] text-[#D8AF7F] bg-transparent"
                  : "border-2 border-[#D8AF7F] bg-white text-black hover:bg-gray-100"
              }`}
            >
              FOREIGN
            </button>

            {/* FAVORITES Button */}
            <button
              onClick={() => handleTabClick("FAVORITES")}
              className={`px-8 py-2 rounded-md font-medium uppercase tracking-wider text-sm transition-all duration-300 ${
                activeTab === "FAVORITES"
                  ? "border-2 border-[#D8AF7F] text-[#D8AF7F] bg-transparent"
                  : "border-2 border-[#D8AF7F] bg-white text-black hover:bg-gray-100"
              }`}
            >
              FAVORITES
            </button>

            {/* PROFILE Button */}
            <button
              onClick={() => navigate("/profile")}
              className="px-8 py-2 rounded-md font-medium uppercase tracking-wider text-sm transition-all duration-300 border-2 border-[#D8AF7F] text-[#D8AF7F] bg-transparent hover:bg-[#D8AF7F]/10"
            >
              PROFILE
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-col items-center w-full max-w-6xl mx-auto px-4 pt-4">
        {/* Carousel Section */}
        <div className="flex items-center justify-center gap-4 md:gap-8 w-full mb-10">
          {/* Featured Display (Large Central Area) */}
          <div
            onClick={handleCarouselClick}
            className={`w-full max-w-2xl h-64 md:h-[400px] bg-[#4a4238] rounded-xl overflow-hidden shadow-2xl relative flex items-center justify-center transition-transform ${
              carouselModels.length > 0
                ? "cursor-pointer hover:scale-[1.02]"
                : ""
            }`}
          >
            {carouselModels.length > 0 ? (
              <img
                key={currentIndex}
                src={carouselModels[currentIndex].imageUrl}
                alt={carouselModels[currentIndex].name}
                className="w-full h-full object-cover animate-fade-in"
              />
            ) : (
              <LoadingSpinner message="Loading carousel" size="default" />
            )}
          </div>
        </div>

        {/* Bottom Grid (Model Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 w-full pb-12 md:pb-20">
          {permissionsLoading ? (
            <div className="col-span-full flex justify-center items-center min-h-[400px]">
              <LoadingSpinner message="Loading..." size="large" />
            </div>
          ) : userPermissions && !userPermissions.canViewModels ? (
            <div className="col-span-full text-center py-20">
              <div className="bg-red-500/20 border-2 border-red-500 rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-6xl mb-4">🚫</div>
                <h3 className="text-2xl font-bold text-red-500 mb-2">
                  Model Access Disabled
                </h3>
                <p className="text-gray-300 mb-6">
                  Your access to view models has been disabled by the
                  administrator. Please contact support for assistance.
                </p>
              </div>
            </div>
          ) : loading ? (
            <div className="col-span-full flex justify-center items-center min-h-[400px]">
              <LoadingSpinner message="Loading models" size="large" />
            </div>
          ) : models.length > 0 ? (
            models.map((model) => (
              <div
                key={model._id}
                onClick={() => handleCardClick(model)}
                className="rounded-3xl p-3 cursor-pointer transition-transform hover:-translate-y-2 relative group"
                style={{ backgroundColor: themeColor }} // Creates the gold border effect
              >
                <div className="w-full h-80 md:h-96 overflow-hidden rounded-2xl bg-black">
                  {model.imageUrl ? (
                    <img
                      src={model.imageUrl}
                      alt={model.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      No Image Available
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-white text-lg">
              No {activeTab.toLowerCase()} models found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
