import React from "react";

const TabButton = ({ tab, activeTab, onClick, navigate, children, delay }) => {
  const themeColor = "#D8AF7F";
  const isActive = activeTab === tab;

  const handleClick = () => {
    if (tab === "PROFILE") {
      navigate("/profile");
    } else {
      onClick(tab);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`text-base md:text-lg lg:text-xl tracking-widest font-bold uppercase transition-all duration-300 relative group animate-tab-slide pb-2 ${delay}`}
      style={{
        color: isActive ? themeColor : "white",
        textShadow: isActive ? `0 0 20px ${themeColor}80` : "none",
      }}
    >
      {children}
      <span
        className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
          isActive ? "w-full" : "w-0 group-hover:w-full"
        }`}
        style={{ backgroundColor: themeColor }}
      ></span>
    </button>
  );
};

export const MainPageHeader = ({ activeTab, handleTabClick, navigate }) => {
  return (
    <>
      <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-10 tracking-wide animate-title-entrance bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
        POWER ALLURE
      </h1>
      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 lg:gap-14 mb-12">
        <TabButton tab="LOCAL" activeTab={activeTab} onClick={handleTabClick} navigate={navigate}>
          Local
        </TabButton>
        <TabButton tab="FOREIGN" activeTab={activeTab} onClick={handleTabClick} navigate={navigate} delay="delay-100">
          Foreign
        </TabButton>
        <TabButton tab="FAVORITES" activeTab={activeTab} onClick={handleTabClick} navigate={navigate} delay="delay-200">
          Favorites
        </TabButton>
        <TabButton tab="PROFILE" activeTab={activeTab} onClick={handleTabClick} navigate={navigate} delay="delay-300">
          Profile
        </TabButton>
      </div>
    </>
  );
};
