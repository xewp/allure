import React from "react";

export const ModelCard = ({
  model,
  handleCardClick,
  userFavorites = [],
  isFavoriteOverride,
}) => {
  const isSaved = userFavorites.some((favorite) => {
    const favoriteModelId = favorite.modelId || favorite._id;
    return String(favoriteModelId) === String(model._id);
  });
  const isFavorite = isFavoriteOverride ?? isSaved;
  const category = model.category || "Talent";
  const modelName = model.name || "Unnamed talent";

  return (
    <button
      type="button"
      onClick={() => handleCardClick(model)}
      aria-label={`View ${modelName}${
        isFavorite ? ", saved to favorites" : ""
      }`}
      className="group relative block aspect-[3/4] w-full min-w-0 overflow-hidden rounded-xl border border-porcelain/10 bg-ink text-left shadow-[0_12px_30px_rgba(0,0,0,0.2)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-brass/50 hover:shadow-[0_18px_40px_rgba(0,0,0,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian motion-reduce:transform-none motion-reduce:transition-none"
    >
      {model.imageUrl ? (
        <img
          src={model.imageUrl}
          alt={`${modelName} portfolio portrait`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] motion-reduce:transform-none motion-reduce:transition-none"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink to-obsidian">
          <span className="font-serif text-5xl text-brass/60" aria-hidden="true">
            {modelName.charAt(0).toUpperCase()}
          </span>
          <span className="sr-only">No portrait available</span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/10 to-transparent" />

      <span className="absolute left-2.5 top-2.5 max-w-[calc(100%-3.75rem)] truncate rounded-md border border-porcelain/15 bg-obsidian/65 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-porcelain backdrop-blur-md sm:left-3 sm:top-3 sm:text-[10px]">
        {category}
      </span>

      {isFavorite && (
        <span
          className="absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full border border-porcelain/15 bg-obsidian/70 text-brass backdrop-blur-md sm:right-3 sm:top-3 sm:h-10 sm:w-10"
          role="img"
          aria-label="Saved to favorites"
        >
          <svg
            aria-hidden="true"
            className="h-4 w-4 fill-current sm:h-5 sm:w-5"
            viewBox="0 0 24 24"
          >
            <path d="m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09A6.01 6.01 0 0 1 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z" />
          </svg>
        </span>
      )}

      <span className="absolute inset-x-0 bottom-0 block p-3 sm:p-4 lg:p-5">
        <span className="block truncate font-serif text-lg font-semibold leading-tight text-porcelain sm:text-xl lg:text-2xl">
          {modelName}
        </span>
        <span className="mt-1 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.12em] text-porcelain/70 sm:text-xs">
          <span>{category}</span>
          {model.age && (
            <>
              <span className="h-0.5 w-0.5 rounded-full bg-brass" />
              <span>Age {model.age}</span>
            </>
          )}
        </span>
      </span>
    </button>
  );
};
