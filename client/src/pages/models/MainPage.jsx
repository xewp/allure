import React from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useMainPageLogic } from "../../hooks/useMainPageLogic";
import { MainPageHeader } from "../../components/main/MainPageHeader";
import {
  ModelGrid,
  ModelGridSkeleton,
} from "../../components/main/ModelGrid";
import { NoModelsFound } from "../../components/main/NoModelsFound";
import Header from "../../components/layout/Header";

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
    loadMoreModels,
    userPermissions,
    permissionsLoading,
    hasMore,
    totalModels,
  } = useMainPageLogic();

  const visibleModelCount =
    activeTab === "FAVORITES" ? models.length : totalModels;

  return (
    <div className="min-h-screen overflow-x-hidden bg-obsidian font-sans text-porcelain">
      <Header activeTab={activeTab} onTabChange={handleTabClick} />

      <main className="mx-auto flex w-full max-w-7xl flex-col items-center px-2.5 sm:px-6 lg:px-8">
        <MainPageHeader
          activeTab={activeTab}
          handleTabClick={handleTabClick}
          modelCount={visibleModelCount}
        />

        {permissionsLoading ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <LoadingSpinner message="Loading..." size="large" />
          </div>
        ) : userPermissions && !userPermissions.canViewModels ? (
          <div className="flex min-h-[50vh] w-full items-center justify-center pb-24">
            <section className="w-full max-w-lg rounded-2xl border border-danger/40 bg-danger/10 p-7 text-center sm:p-10">
              <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-danger/40 text-danger">
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
                    strokeWidth={1.7}
                    d="M18.36 18.36A9 9 0 1 1 5.64 5.64m12.72 12.72L5.64 5.64"
                  />
                </svg>
              </span>
              <h2 className="font-serif text-3xl font-semibold text-porcelain">
                Talent access unavailable
              </h2>
              <p className="mt-3 leading-relaxed text-taupe">
                Your access to view talent has been disabled by an
                administrator. Please contact support for assistance.
              </p>
            </section>
          </div>
        ) : loading ? (
          <div className="w-full pb-28 md:pb-16">
            <ModelGridSkeleton />
          </div>
        ) : models.length > 0 ? (
          <ModelGrid
            featuredModels={featuredModels}
            regularModels={regularModels}
            handleCardClick={handleCardClick}
            userFavorites={userFavorites}
            hasMore={
              hasMore && (activeTab === "LOCAL" || activeTab === "FOREIGN")
            }
            loading={loading}
            onLoadMore={loadMoreModels}
          />
        ) : (
          <NoModelsFound activeTab={activeTab} />
        )}
      </main>
    </div>
  );
};

export default MainPage;
