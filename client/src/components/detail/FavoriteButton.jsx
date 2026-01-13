import React from "react";

export const FavoriteButton = ({ isFavorite, toggleFavorite }) => {
  return (
    <button
      onClick={toggleFavorite}
      className="group relative w-full inline-flex items-center justify-center gap-3 px-10 py-4 bg-gold text-black font-semibold text-lg rounded-full overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-gold-lg"
    >
      <span className="relative z-10 flex items-center gap-3">
        {isFavorite ? (
          <svg
            className="h-6 w-6 text-black"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        ) : (
          <svg
            className="h-6 w-6"
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
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </span>
      <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </button>
  );
};
