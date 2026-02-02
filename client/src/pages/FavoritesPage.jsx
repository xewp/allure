import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";
import API_URL from "../config/api";

const FavoritesPage = () => {
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
            setFavorites(data);
          }
        } catch (error) {

        }
      }
      setLoading(false);
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header activeTab="FAVORITES" onTabChange={() => {}} />
      <div className="p-4 md:p-6 lg:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
          My Favorites
        </h1>
        {favorites.length === 0 ? (
          <p>You have no favorites yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {favorites.map((fav) => (
              <Link to={`/model/${fav._id}`} key={fav._id} className="block">
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={fav.image}
                    alt={fav.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-bold">{fav.title}</h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
