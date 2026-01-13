import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import API_URL from "../../config/api";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user._id) {
        try {
          const response = await fetch(
            `${API_URL}/api/users/${user._id}/favorites`
          );
          if (response.ok) {
            const data = await response.json();
            const validFavorites = data.filter(
              (fav) => fav._id && fav._id !== "undefined"
            );
            setFavorites(validFavorites);
          }
        } catch (error) {
          console.error("Failed to fetch favorites", error);
        }
      }
      setLoading(false);
    };

    fetchFavorites();

    // Listen for favorites updates
    const handleFavoritesUpdate = () => {
      fetchFavorites();
    };

    window.addEventListener("favoritesUpdated", handleFavoritesUpdate);

    return () => {
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdate);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <LoadingSpinner message="Loading your collection" size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <Header activeTab="FAVORITES" onTabChange={() => {}} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        {/* Elegant Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
            Your Collection
          </h1>
          {favorites.length > 0 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold"></div>
              <p className="text-gold text-lg">
                {favorites.length} {favorites.length === 1 ? "Model" : "Models"}{" "}
                Saved
              </p>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold"></div>
            </div>
          )}
        </div>

        {favorites.length === 0 ? (
          /* Elegant Empty State */
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-32 h-32 mb-8 rounded-full bg-gold/10 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gold"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gold mb-4">
              No Favorites Yet
            </h2>
            <p className="text-gray-400 text-lg text-center max-w-md mb-8">
              Start building your collection of exceptional talent. Explore our
              models and add your favorites.
            </p>
            <button
              onClick={() => navigate("/main")}
              className="px-8 py-3 bg-gold text-black font-semibold rounded-full hover:bg-gold-light transition-all duration-300 hover:scale-105 shadow-gold"
            >
              Browse Models
            </button>
          </div>
        ) : (
          /* Premium Grid Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((fav, index) => (
              <div
                key={`${fav._id}-${index}`}
                onClick={() => navigate(`/model/${fav._id}`)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 animate-fade-in-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                  background: `linear-gradient(135deg, rgba(216, 175, 127, 0.1), rgba(216, 175, 127, 0.2))`,
                  padding: "2px",
                }}
              >
                <div className="relative h-96 bg-gradient-to-br from-gray-900 to-black rounded-[1rem] overflow-hidden">
                  {fav.imageUrl ? (
                    <>
                      <img
                        src={fav.imageUrl}
                        alt={fav.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gold/20 backdrop-blur-md border border-gold/50">
                        <span className="text-gold text-xs font-semibold uppercase tracking-wider">
                          {fav.category || "Local"}
                        </span>
                      </div>

                      {/* Favorite Heart (Always Visible) */}
                      <div className="absolute top-4 right-4">
                        <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-gold fill-gold"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        </div>
                      </div>

                      {/* Model Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-2xl font-bold text-gold mb-1">
                          {fav.name}
                        </h3>
                        {fav.age && (
                          <p className="text-white/70 text-sm">
                            Age: {fav.age}
                          </p>
                        )}
                      </div>

                      {/* Hover Glow */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[1rem]"
                        style={{
                          boxShadow: `inset 0 0 60px rgba(216, 175, 127, 0.3)`,
                        }}
                      ></div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      No Image Available
                    </div>
                  )}
                </div>

                {/* Border Glow on Hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-gold-lg"></div>
              </div>
            ))}
          </div>
        )}

        {/* Book Now CTA */}
        {favorites.length > 0 && (
          <div className="mt-20 text-center">
            <div className="inline-block p-8 rounded-3xl bg-gradient-to-br from-warm-gray/30 to-charcoal/30 backdrop-blur-sm border border-gold/20">
              <h3 className="font-serif text-3xl md:text-4xl font-bold text-gold mb-4">
                Ready to Book?
              </h3>
              <p className="text-gray-300 mb-6 max-w-md mx-auto">
                Transform your event with our exceptional talent. Book your
                favorite models now.
              </p>
              <button
                onClick={() => navigate("/booking")}
                className="px-10 py-4 bg-gold text-black font-semibold text-lg rounded-full hover:bg-white transition-all duration-300 hover:scale-105 shadow-gold"
              >
                Book Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
