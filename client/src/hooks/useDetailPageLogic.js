import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API_URL from "../config/api";

export const useDetailPageLogic = () => {
  const { name } = useParams(); // Get name from URL (for display only)
  const location = useLocation();
  const navigate = useNavigate();

  // Get the actual model ID from location.state (passed during navigation)
  const modelId = location.state?.modelId;

  const [activeTab, setActiveTab] = useState("LOCAL");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modelData, setModelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (location.state?.category) {
      setActiveTab(location.state.category);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchModelData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/models/${modelId}`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setModelData(data);

        // Check if model is in user's favorites (convert both IDs to strings for comparison)
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.favorites && Array.isArray(user.favorites)) {
          const isFav = user.favorites.some((fav) => String(fav.modelId) === String(data._id));
          setIsFavorite(isFav);
        }
      } catch (error) {
        console.error("Error fetching model data:", error);
        setModelData(null);
        navigate("/error", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    if (modelId && modelId !== "undefined") {
      fetchModelData();
    } else {
      setLoading(false);
      navigate("/error", { replace: true });
    }
  }, [modelId, navigate]);

  // Re-check favorite status whenever modelData changes or component remounts
  useEffect(() => {
    if (modelData) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.favorites && Array.isArray(user.favorites)) {
        const isFav = user.favorites.some((fav) => String(fav.modelId) === String(modelData._id));
        setIsFavorite(isFav);
      }
    }
  }, [modelData]);

  const galleryImages =
    modelData?.galleryImages?.length > 0
      ? modelData.galleryImages
      : modelData?.imageUrl
      ? [modelData.imageUrl]
      : [];

  const primaryImageUrl =
    modelData?.imageUrl || (galleryImages.length > 0 ? galleryImages[0] : "");

  const toggleFavorite = async () => {
    if (!modelData) return;
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }

    // Check if already favorited (for add operation)
    const isAlreadyFavorited = user.favorites?.some((fav) => String(fav.modelId) === String(modelData._id));
    
    if (!isFavorite && isAlreadyFavorited) {
      // Already in favorites, just update UI state
      setIsFavorite(true);
      return;
    }

    const endpoint = isFavorite ? "remove" : "add";
    try {
      const response = await fetch(
        `${API_URL}/api/users/favorites/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user._id,
            modelId: modelData._id,
            name: modelData.name,
            imageUrl: primaryImageUrl,
            category: modelData.category || "Foreign",
          }),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        
        // Merge the updated user data with existing user object to preserve all fields
        const mergedUser = {
          ...user,
          ...updatedUser,
          _id: updatedUser._id || user._id, // Ensure _id is preserved
        };
        
        localStorage.setItem("user", JSON.stringify(mergedUser));
        setIsFavorite(!isFavorite);
        
        // Dispatch custom event to notify other components about favorites change
        window.dispatchEvent(new CustomEvent('favoritesUpdated', { 
          detail: { favorites: mergedUser.favorites } 
        }));
      }
    } catch (error) {
      console.error("Failed to update favorites", error);
    }
  };

  useEffect(() => {
    if (galleryImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  return {
    activeTab,
    currentIndex,
    modelData,
    loading,
    isFavorite,
    mounted,
    galleryImages,
    setActiveTab,
    setCurrentIndex,
    toggleFavorite,
    navigate,
  };
};
