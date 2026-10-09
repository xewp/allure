import React from "react";
import { ModelCard } from "./ModelCard";

export const ModelGridSkeleton = ({ count = 8 }) => (
  <div
    className="grid w-full grid-cols-2 gap-x-2.5 gap-y-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6"
    aria-label="Loading talent profiles"
    aria-busy="true"
  >
    {Array.from({ length: count }, (_, index) => (
      <div
        key={index}
        className="aspect-[3/4] animate-pulse overflow-hidden rounded-xl border border-porcelain/5 bg-ink motion-reduce:animate-none"
      >
        <div className="h-3/4 bg-porcelain/5" />
        <div className="space-y-2 p-3">
          <div className="h-3 w-3/4 rounded bg-porcelain/10" />
          <div className="h-2 w-1/2 rounded bg-porcelain/5" />
        </div>
      </div>
    ))}
  </div>
);

export const ModelGrid = ({
  featuredModels = [],
  regularModels = [],
  handleCardClick,
  userFavorites = [],
  allModelsAreFavorites = false,
  hasMore = false,
  loading = false,
  onLoadMore,
}) => {
  const allModels = [...featuredModels, ...regularModels];

  return (
    <div className="w-full pb-28 md:pb-16">
      <div className="grid grid-cols-2 gap-x-2.5 gap-y-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6">
        {allModels.map((model, index) => (
          <ModelCard
            key={model._id || `${model.name}-${index}`}
            model={model}
            handleCardClick={handleCardClick}
            userFavorites={userFavorites}
            isFavoriteOverride={allModelsAreFavorites ? true : undefined}
          />
        ))}
      </div>

      {hasMore && onLoadMore && (
        <div className="flex justify-center pt-10 md:pt-12">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loading}
            aria-busy={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-brass/50 bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-brass transition-colors hover:bg-brass hover:text-obsidian focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian disabled:cursor-wait disabled:opacity-50"
          >
            {loading && (
              <svg
                aria-hidden="true"
                className="h-4 w-4 animate-spin motion-reduce:animate-none"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 0 1 8-8V0C5.37 0 0 5.37 0 12h4Z"
                />
              </svg>
            )}
            {loading ? "Loading talent" : "Load more talent"}
          </button>
        </div>
      )}
    </div>
  );
};
