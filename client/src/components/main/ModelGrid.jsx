import React from "react";
import { ModelCard } from "./ModelCard";

export const ModelGrid = ({
  featuredModels,
  regularModels,
  handleCardClick,
  userFavorites = [],
}) => {
  const regularModelsWithLayout = regularModels.map((model, index) => {
    const isLarge = index % 7 === 0;
    const isMedium = index % 3 === 0 && !isLarge;
    return { ...model, isLarge, isMedium };
  });

  return (
    <div className="w-full pb-16 space-y-8">
      {featuredModels.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {featuredModels.map((model) => (
            <ModelCard
              key={model._id}
              model={model}
              handleCardClick={handleCardClick}
              isFeatured={true}
              userFavorites={userFavorites}
            />
          ))}
        </div>
      )}
      {regularModels.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-auto">
          {regularModelsWithLayout.map((model) => (
            <ModelCard
              key={model._id}
              model={model}
              handleCardClick={handleCardClick}
              isFeatured={false}
              userFavorites={userFavorites}
            />
          ))}
        </div>
      )}
    </div>
  );
};
