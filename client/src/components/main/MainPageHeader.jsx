import React from "react";

const tabs = ["LOCAL", "FOREIGN", "FAVORITES"];

const TabButton = ({ tab, activeTab, onClick }) => {
  const isActive = activeTab === tab;

  return (
    <button
      type="button"
      onClick={() => onClick(tab)}
      aria-pressed={isActive}
      className={`min-h-10 rounded-md px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:text-xs ${
        isActive
          ? "bg-porcelain text-obsidian shadow-sm"
          : "text-taupe hover:bg-porcelain/5 hover:text-porcelain"
      }`}
    >
      {tab === "FAVORITES" ? "Favorites" : tab.toLowerCase()}
    </button>
  );
};

export const MainPageHeader = ({
  activeTab,
  handleTabClick,
  modelCount,
}) => {
  const directoryLabel =
    activeTab === "FAVORITES"
      ? "Your saved selection"
      : `${activeTab.toLowerCase()} talent`;

  return (
    <div className="w-full pt-8 sm:pt-10 lg:pt-14">
      <div className="mb-7 grid gap-5 text-left md:grid-cols-[minmax(0,1fr)_auto] md:items-end lg:mb-9">
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-brass sm:text-xs">
            Curated directory · {directoryLabel}
          </p>
          <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-[0.98] text-porcelain sm:text-5xl lg:text-6xl">
            Find the right presence for the moment.
          </h1>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-taupe md:text-right">
          {modelCount > 0
            ? `${modelCount} ${modelCount === 1 ? "profile" : "profiles"} in this selection`
            : "Curated talent for campaigns, events, and distinctive productions."}
        </p>
      </div>

      <div className="sticky top-16 z-30 mb-5 border-y border-porcelain/10 bg-obsidian/95 py-2 backdrop-blur-xl sm:mb-7">
        <div
          className="grid grid-cols-3 gap-1 rounded-lg bg-ink p-1"
          role="group"
          aria-label="Filter talent by collection"
        >
          {tabs.map((tab) => (
            <TabButton
              key={tab}
              tab={tab}
              activeTab={activeTab}
              onClick={handleTabClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
