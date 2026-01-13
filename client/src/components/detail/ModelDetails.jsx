import React from "react";
import { FavoriteButton } from "./FavoriteButton";

export const ModelDetails = ({
  modelData,
  isFavorite,
  toggleFavorite,
  onBookNow,
}) => {
  return (
    <div className="lg:col-span-2 flex flex-col pt-8 animate-slide-up">
      <div className="mb-6">
        <span className="bg-gold/10 text-gold text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-gold/30">
          {modelData.category || "Foreign"}
        </span>
      </div>

      <h1 className="font-serif text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
        {modelData.name?.toUpperCase() || "UNKNOWN"}
      </h1>

      <div className="bg-charcoal border border-gold/10 rounded-2xl p-6 mb-8 shadow-elegant">
        <h3 className="font-serif text-2xl text-gold mb-4">Stats</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-gray-400 text-sm">Age</p>
            <p className="text-white text-xl font-semibold">
              {modelData.age || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Weight</p>
            <p className="text-white text-xl font-semibold">
              {modelData.weight || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Height</p>
            <p className="text-white text-xl font-semibold">
              {modelData.height || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-charcoal border border-gold/10 rounded-2xl p-6 mb-8 shadow-elegant">
        <h3 className="font-serif text-2xl text-gold mb-4">
          About {modelData.name}
        </h3>
        <p className="text-gray-300 leading-relaxed font-light">
          {modelData.description || "No description available."}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <FavoriteButton
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
        />

        <button
          onClick={onBookNow}
          className="group relative px-8 py-4 bg-gradient-to-r from-gold-light via-gold to-gold-dark text-black font-bold text-lg rounded-xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-gold-lg"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Book Now
          </span>
        </button>
      </div>
    </div>
  );
};
