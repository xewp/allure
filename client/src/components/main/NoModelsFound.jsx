import React from "react";

export const NoModelsFound = ({ activeTab }) => {
  const themeColor = "#D8AF7F";
  return (
    <div className="text-center text-white text-lg py-32">
      <p className="text-3xl mb-3 font-bold" style={{ color: themeColor }}>
        No {activeTab.toLowerCase()} models found
      </p>
      <p className="text-gray-400 text-xl">Check back later for updates</p>
    </div>
  );
};
