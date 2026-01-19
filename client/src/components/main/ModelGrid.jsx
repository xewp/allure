import React from "react";
import { ModelCard } from "./ModelCard";

export const ModelGrid = ({
  featuredModels,
  regularModels,
  handleCardClick,
  userFavorites = [],
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
    </div>
  );
};
