import React from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useMainPageLogic } from "../../hooks/useMainPageLogic";
import { MainPageHeader } from "../../components/main/MainPageHeader";
import { ModelGrid } from "../../components/main/ModelGrid";
import { NoModelsFound } from "../../components/main/NoModelsFound";

const MainPage = () => {
  const {
    activeTab,
    models,
    loading,
    featuredModels,
    regularModels,
    userFavorites,
    handleCardClick,
    handleTabClick,
    navigate,
    userPermissions,
    permissionsLoading,
  } = useMainPageLogic();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white font-sans flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-yellow-900/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-amber-900/10 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="flex flex-col items-center w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-6 relative z-10">
        <MainPageHeader
          activeTab={activeTab}
          handleTabClick={handleTabClick}
          navigate={navigate}
        />

        {permissionsLoading ? (
          <div className="flex justify-center items-center min-h-[600px]">
            <LoadingSpinner message="Loading..." size="large" />
          </div>
        ) : userPermissions && !userPermissions.canViewModels ? (
          <div className="flex justify-center items-center min-h-[600px]">
            <div className="bg-red-500/20 border-2 border-red-500 rounded-2xl p-8 max-w-md text-center">
              <div className="text-6xl mb-4">🚫</div>
              <h3 className="text-2xl font-bold text-red-500 mb-2">
                Model Access Disabled
              </h3>
              <p className="text-gray-300">
                Your access to view models has been disabled by the
                administrator. Please contact support.
              </p>
            </div>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center min-h-[600px]">
            <LoadingSpinner message="Loading models" size="large" />
          </div>
        ) : models.length > 0 ? (
          <ModelGrid
            featuredModels={featuredModels}
            regularModels={regularModels}
            handleCardClick={handleCardClick}
            userFavorites={userFavorites}
          />
        ) : (
          <NoModelsFound activeTab={activeTab} />
        )}
      </div>
    </div>
  );
};

export default MainPage;
