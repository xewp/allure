import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import {
  ModelGrid,
  ModelGridSkeleton,
} from "../../components/main/ModelGrid";
import API_URL from "../../config/api";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const user = JSON.parse(
        sessionStorage.getItem("user") ||
          localStorage.getItem("user") ||
          "null",
      );
      const userId = user?._id || user?.id;

      if (userId) {
        try {
          const response = await fetch(
            `${API_URL}/api/users/${userId}/favorites`,
          );
          if (response.ok) {
            const data = await response.json();
            const validFavorites = data.filter(
              (favorite) =>
                favorite._id && favorite._id !== "undefined",
            );
            setFavorites(validFavorites);
          }
        } catch {
          // Keep the saved collection empty when it cannot be loaded.
        }
      }
      setLoading(false);
    };

    fetchFavorites();

    const handleFavoritesUpdate = () => {
      fetchFavorites();
    };

    window.addEventListener("favoritesUpdated", handleFavoritesUpdate);

    return () => {
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdate);
    };
  }, []);

  const handleCardClick = (model) => {
    const modelSlug = (model.name || "talent")
      .toLowerCase()
      .replace(/\s+/g, "-");

    navigate(`/model/${modelSlug}`, {
      state: {
        selectedImage: model.imageUrl,
        category: model.category?.toUpperCase() || "FAVORITES",
        modelId: model._id,
      },
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-obsidian font-sans text-porcelain">
      <Header activeTab="FAVORITES" onTabChange={() => {}} />

      <main className="mx-auto w-full max-w-7xl px-2.5 pb-28 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-14">
        <header className="mb-7 grid gap-5 text-left md:grid-cols-[minmax(0,1fr)_auto] md:items-end lg:mb-10">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-brass sm:text-xs">
              Your shortlist
            </p>
            <h1 className="font-serif text-4xl font-semibold leading-none text-porcelain sm:text-5xl lg:text-6xl">
              Saved talent
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-taupe sm:text-base">
              A considered collection of the people you want to remember,
              compare, and bring into your next event.
            </p>
          </div>

          {!loading && favorites.length > 0 && (
            <p className="border-l border-brass/50 pl-4 text-sm text-taupe md:text-right">
              <span className="block font-serif text-3xl text-porcelain">
                {favorites.length.toString().padStart(2, "0")}
              </span>
              {favorites.length === 1 ? "profile saved" : "profiles saved"}
            </p>
          )}
        </header>

        {loading ? (
          <ModelGridSkeleton />
        ) : favorites.length === 0 ? (
          <section className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-porcelain/10 bg-ink px-6 py-16 text-center">
            <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-brass/30 bg-brass/10 text-brass">
              <svg
                aria-hidden="true"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0Z"
                />
              </svg>
            </span>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brass">
              Build your shortlist
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-porcelain sm:text-4xl">
              No favorites yet
            </h2>
            <p className="mt-3 max-w-md leading-relaxed text-taupe">
              Explore the directory and save the talent that feels right for
              your campaign or event.
            </p>
            <button
              type="button"
              onClick={() => navigate("/main")}
              className="mt-8 min-h-11 rounded-lg bg-oxblood px-6 py-3 text-sm font-semibold text-porcelain transition-colors hover:bg-oxblood/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Browse talent
            </button>
          </section>
        ) : (
          <>
            <ModelGrid
              featuredModels={[]}
              regularModels={favorites}
              handleCardClick={handleCardClick}
              allModelsAreFavorites
            />

            <section className="mb-6 mt-2 grid gap-6 rounded-2xl border border-porcelain/10 bg-ink p-6 text-left sm:p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center lg:p-10">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brass">
                  Ready when you are
                </p>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-porcelain sm:text-4xl">
                  Turn your shortlist into a booking.
                </h2>
                <p className="mt-3 max-w-xl leading-relaxed text-taupe">
                  Share your event details and preferred talent with the
                  VELORA team.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/booking")}
                className="min-h-12 rounded-lg bg-oxblood px-7 py-3 text-sm font-semibold text-porcelain transition-colors hover:bg-oxblood/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                Start a booking
              </button>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default FavoritesPage;
