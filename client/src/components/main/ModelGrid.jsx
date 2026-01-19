import React from "react";
import { ModelCard } from "./ModelCard";

export const ModelGrid = ({
  featuredModels,
  regularModels,
  handleCardClick,
  userFavorites = [],
  hasMore = false,
  loading = false,
  onLoadMore,
}) => {
  // Combine all models into one array
  const allModels = [...featuredModels, ...regularModels];

  // Group models into alternating rows of 2 and 3
  const rows = [];
  let currentIndex = 0;
  let rowType = 2; // Start with 2 per row

  while (currentIndex < allModels.length) {
    const rowModels = allModels.slice(currentIndex, currentIndex + rowType);
    rows.push({ models: rowModels, columns: rowType });
    currentIndex += rowType;
    rowType = rowType === 2 ? 3 : 2; // Alternate between 2 and 3
  }

  return (
    <div className="w-full space-y-6 md:space-y-8 pb-12 md:pb-20">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`grid gap-4 md:gap-6 lg:gap-8 ${
            row.columns === 2
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {row.models.map((model) => (
            <ModelCard
              key={model._id}
              model={model}
              handleCardClick={handleCardClick}
              isFeatured={false}
              userFavorites={userFavorites}
            />
          ))}
        </div>
      ))}

      {/* Load More Button */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center pt-8">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="group relative px-8 py-4 bg-gradient-to-r from-amber-600 to-yellow-500 text-white font-semibold rounded-xl 
                     hover:from-amber-500 hover:to-yellow-400 
                     transform hover:scale-105 transition-all duration-300 
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                     shadow-lg hover:shadow-xl"
          >
            <span className="flex items-center gap-2">
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  Load More Models
                  <svg
                    className="w-5 h-5 group-hover:translate-y-0.5 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </>
              )}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
