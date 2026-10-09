import React from "react";

export const NoModelsFound = ({ activeTab }) => {
  const collectionName =
    activeTab === "FAVORITES"
      ? "saved talent"
      : `${activeTab.toLowerCase()} talent`;

  return (
    <section className="mx-auto my-8 flex w-full max-w-2xl flex-col items-center rounded-2xl border border-porcelain/10 bg-ink px-6 py-16 text-center sm:px-10 sm:py-20">
      <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-brass/30 bg-brass/10 text-brass">
        <svg
          aria-hidden="true"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.6}
            d="M4.5 19.5 9 15m-4.5 4.5H15a4.5 4.5 0 1 0 0-9h-.17A6 6 0 0 0 3 12"
          />
        </svg>
      </span>
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brass">
        Collection update
      </p>
      <h2 className="mt-3 font-serif text-3xl font-semibold text-porcelain sm:text-4xl">
        No {collectionName} found
      </h2>
      <p className="mt-3 max-w-md leading-relaxed text-taupe">
        This selection is currently being curated. Check back soon for new
        profiles.
      </p>
    </section>
  );
};
