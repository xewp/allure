import React from "react";

const TabButton = ({ tab, activeTab, onClick, navigate, children }) => {
  const handleClick = () => {
    if (tab === "PROFILE") {
      navigate("/profile");
    } else {
      onClick(tab);
    }
  };

  const isActive = activeTab === tab;

  return (
    <button
      onClick={handleClick}
      className={`px-8 py-2 rounded-md font-medium uppercase tracking-wider text-sm transition-all duration-300 ${
        isActive
          ? "border-2 border-[#D8AF7F] bg-white text-black"
          : "border-2 border-[#D8AF7F] text-[#D8AF7F] bg-transparent hover:bg-[#D8AF7F]/10"
      }`}
    >
      {children}
    </button>
  );
};

export const MainPageHeader = ({ activeTab, handleTabClick, navigate }) => {
  return (
    <>
      <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-10 tracking-wide text-center bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
        POWER ALLURE
      </h1>
      <div className="flex flex-wrap justify-center items-center gap-20 md:gap-22 mb-12">
        <TabButton
          tab="LOCAL"
          activeTab={activeTab}
          onClick={handleTabClick}
          navigate={navigate}
        >
          LOCAL
        </TabButton>
        <TabButton
          tab="FOREIGN"
          activeTab={activeTab}
          onClick={handleTabClick}
          navigate={navigate}
        >
          FOREIGN
        </TabButton>
        <TabButton
          tab="FAVORITES"
          activeTab={activeTab}
          onClick={handleTabClick}
          navigate={navigate}
        >
          FAVORITES
        </TabButton>
        <TabButton
          tab="PROFILE"
          activeTab={activeTab}
          onClick={handleTabClick}
          navigate={navigate}
        >
          PROFILE
        </TabButton>
      </div>
    </>
  );
};
