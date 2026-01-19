import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API_URL from "../config/api";

export const useMainPageLogic = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "LOCAL"
  );
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userPermissions, setUserPermissions] = useState(null);
  const [permissionsLoading, setPermissionsLoading] = useState(true);

  // Fetch user permissions on mount
  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = storedUser.id || storedUser._id;
        const token = localStorage.getItem("token");

        if (!userId || !token) {
          setPermissionsLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUserPermissions({
            canViewModels: data.user.canViewModels !== false,
          });
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
      } finally {
        setPermissionsLoading(false);
      }
    };

    fetchUserPermissions();
  }, []);

  const fetchModels = async (category) => {
    setLoading(true);
    try {
      const endpoint = category === "LOCAL" ? "local" : "foreign";
      const response = await fetch(
        `${API_URL}/models/${endpoint}?available=true`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setModels(data);
    } catch (error) {
      console.error("Error fetching models:", error);
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        console.warn("No user found in localStorage");
        setModels([]);
        setLoading(false);
        return;
      }

      const user = JSON.parse(userStr);
      
      // Validate user object has an _id field
      if (!user || !user._id) {
        console.error("Invalid user object in localStorage - missing _id", user);
        setModels([]);
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_URL}/api/users/${user._id}/favorites`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const favorites = await response.json();
      const validFavorites = favorites.filter((fav) => {
        const hasValidId = fav._id && fav._id !== "undefined";
        if (!hasValidId) {
          console.warn("Favorite missing valid _id:", fav);
        }
        return hasValidId;
      });
      setModels(validFavorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "LOCAL" || activeTab === "FOREIGN") {
      fetchModels(activeTab);
    } else if (activeTab === "FAVORITES") {
      fetchFavorites();
    }
  }, [activeTab]);

  const handleCardClick = (model) => {
    // Convert model name to URL-friendly slug (lowercase, replace spaces with hyphens)
    const modelSlug = model.name.toLowerCase().replace(/\s+/g, '-');
    
    navigate(`/model/${modelSlug}`, {
      state: { 
        selectedImage: model.imageUrl, 
        category: activeTab,
        modelId: model._id // Pass the actual ID through state (hidden from URL)
      },
    });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const featuredModels = models.slice(0, 2);
  const regularModels = models.slice(2);

  // Get user favorites from localStorage - update reactively
  const [userFavorites, setUserFavorites] = useState([]);
  
  useEffect(() => {
    const updateFavorites = () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setUserFavorites(user?.favorites || []);
      } catch {
        setUserFavorites([]);
      }
    };
    
    // Initial load
    updateFavorites();
    
    // Listen for favorites updates from other components
    window.addEventListener('favoritesUpdated', updateFavorites);
    
    return () => {
      window.removeEventListener('favoritesUpdated', updateFavorites);
    };
  }, [activeTab, models]); // Update when activeTab or models change

  return {
    activeTab,
    models,
    loading,
    featuredModels,
    regularModels,
    userFavorites,
    handleCardClick,
    handleTabClick,
    navigate,
    userPermissions,
    permissionsLoading,
  };
};
