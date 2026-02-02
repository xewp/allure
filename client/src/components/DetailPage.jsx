import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import LoadingSpinner from "./LoadingSpinner";
import API_URL from "../config/api";

const DetailPage = () => {
  const { name } = useParams(); // Get name from URL (for display only)
  const location = useLocation();
  const navigate = useNavigate();
  const themeColor = "#D8AF7F";
  const statBgColor = "bg-[#4F4949]";

  // Get the actual model ID from location.state (passed during navigation)
  const modelId = location.state?.modelId;

  // State for active tab in header
  const [activeTab, setActiveTab] = useState("LOCAL");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modelData, setModelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [visibleSections, setVisibleSections] = useState(
    new Set(["gallery", "details"])
  );
  const [mounted, setMounted] = useState(false);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections(
            (prev) => new Set([...prev, entry.target.dataset.section])
          );
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    const sections = document.querySelectorAll("[data-section]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Set activeTab based on navigation state (category from MainPage)
  useEffect(() => {
    if (location.state?.category) {
      setActiveTab(location.state.category);
    }
  }, [location.state]);

  // Fetch model data from API using the modelId from state
  useEffect(() => {
    const fetchModelData = async () => {
      try {
        const response = await fetch(`${API_URL}/models/${modelId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setModelData(data);

        // Check if model is already in favorites
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.favorites) {
          const isAlreadyFavorite = user.favorites.some(
            (fav) => fav.modelId === data._id
          );
          setIsFavorite(isAlreadyFavorite);
        }
      } catch (error) {

        setModelData(null);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if modelId exists
    if (modelId && modelId !== "undefined") {
      fetchModelData();
    } else {
      // If no modelId in state, redirect to error page
      setLoading(false);
      setModelData(null);
      navigate("/error", { replace: true });
    }
  }, [modelId, navigate]);

  // Gallery images: use galleryImages array if available, otherwise use imageUrl
  const galleryImages =
    modelData?.galleryImages && modelData.galleryImages.length > 0
      ? modelData.galleryImages
      : modelData?.imageUrl
      ? [modelData.imageUrl]
      : [];

  // Get the primary image URL for saving to favorites
  const primaryImageUrl =
    modelData?.imageUrl || (galleryImages.length > 0 ? galleryImages[0] : "");

  const toggleFavorite = async () => {
    if (!modelData) return;
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login to add favorites");
      return;
    }

    const endpoint = isFavorite ? "remove" : "add";
    try {
      const requestBody = isFavorite
        ? { userId: user._id, modelId: modelData._id }
        : {
            userId: user._id,
            modelId: modelData._id,
            name: modelData.name,
            username: user.username,
            password: user.password,
            imageUrl: primaryImageUrl,
            category: modelData.category || "Foreign",
          };

      const response = await fetch(
        `${API_URL}/api/users/favorites/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        setIsFavorite(!isFavorite);
        // Update user in local storage
        if (isFavorite) {
          user.favorites = user.favorites.filter(
            (fav) => fav.modelId !== modelData._id
          );
        } else {
          user.favorites.push({
            modelId: modelData._id,
            name: modelData.name,
            username: user.username,
            password: user.password,
            imageUrl: primaryImageUrl,
            category: modelData.category || "Foreign",
          });
        }
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {

    }
  };

  // Effect for auto-play
  useEffect(() => {
    if (galleryImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [galleryImages.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <LoadingSpinner message="Loading model details" size="large" />
      </div>
    );
  }

  if (!modelData) {
    // Redirect to error page if model not found
    navigate("/error", { replace: true });
    return null;
  }

  return (
    <div
      className={`min-h-screen bg-black text-white p-8 font-sans transition-all duration-1000 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <button
        onClick={() => navigate(-1)}
        className={`
    flex items-center text-lg mt-6
    hover:opacity-80 transition-all duration-700 delay-200
    bg-transparent          /* <- no background */
    border-none             /* <- remove browser border */
    outline-none            /* <- optional: no focus outline */
    cursor-pointer          /* <- keep the hand cursor */
    ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}
  `}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        Home
      </button>

      <div className="flex flex-col lg:flex-row gap-[100px] w-full max-w-[1800px] ml-auto pl-[150px] pr-[50px]">
        {/* --- Left Column: Image Gallery --- */}
        <div
          data-section="gallery"
          className={`w-full lg:w-1/2 relative transition-all duration-1000 delay-300 ${
            mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`}
        >
          {/* Big Picture */}
          <div className="rounded-3xl overflow-hidden h-[500px] lg:h-[900px] border-2 border-gray-800">
            {galleryImages.length > 0 ? (
              <img
                key={currentIndex}
                src={galleryImages[currentIndex]}
                alt={modelData.name}
                className="w-full h-full object-cover animate-fade-in"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-16 overflow-x-auto pb-2">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 rounded-2xl overflow-hidden h-24 w-24 cursor-pointer border-2 transition-all hover:scale-105`}
                  style={{
                    borderColor:
                      index === currentIndex ? themeColor : "transparent",
                  }}
                >
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- Right Column: Model Details --- */}
        <div
          data-section="details"
          className={`w-full lg:w-1/3 flex flex-col items-center text-center justify-center transition-all duration-1000 delay-500 ${
            mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          }`}
        >
          <div className="flex justify-center mb-8">
            <div
              className="px-8 py-3 rounded-full"
              style={{ backgroundColor: "#4e4847" }}
            >
              <span
                className="text-xl font-semibold"
                style={{ color: themeColor }}
              >
                {modelData.category || "Foreign"}
              </span>
            </div>
          </div>
          {/* Name */}
          <div className="flex items-center gap-4 mb-12">
            <h1
              className="text-5xl font-bold italic"
              style={{ color: themeColor }}
            >
              {modelData.name?.toUpperCase() || "UNKNOWN"}
            </h1>
          </div>

          {/* Stats Section */}
          <div className="w-full mb-12 relative px-0">
            {/* Connector Bar */}
            <div
              className={`absolute top-1/2 left-0 w-full h-5 -translate-y-1/2 ${statBgColor} z-0 rounded-full`}
            />

            {/* Stats Pills */}
            <div className="relative z-10 flex justify-between w-full">
              {/* Age */}
              <div
                className={`${statBgColor} rounded-full px-6 py-4 text-xl`}
                style={{ color: themeColor }}
              >
                Age: {modelData.age || "N/A"}
              </div>

              {/* Weight */}
              <div
                className={`${statBgColor} rounded-full px-6 py-4 text-xl`}
                style={{ color: themeColor }}
              >
                Weight: {modelData.weight || "N/A"}
              </div>

              {/* Height */}
              <div
                className={`${statBgColor} rounded-full px-6 py-4 text-xl`}
                style={{ color: themeColor }}
              >
                Height: {modelData.height || "N/A"}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div
            className="border-2 rounded-3xl p-16 mb-12 max-w-md"
            style={{ borderColor: themeColor }}
          >
            <h3 className="text-xl font-bold mb-4">
              <span style={{ color: themeColor }}>ABOUT</span> {modelData.name}
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {modelData.description || "No description available."}
            </p>
          </div>

          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            className="bg-white text-black px-8 py-3 rounded-full flex items-center gap-2 font-bold hover:bg-gray-200 transition-colors"
          >
            {isFavorite ? (
              <svg
                className="h-5 w-5 text-black fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            )}
            {isFavorite ? "Remove from favorites" : "Add to favorites"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
