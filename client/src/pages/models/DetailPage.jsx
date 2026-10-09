import React, { useState } from "react";
import { useDetailPageLogic } from "../../hooks/useDetailPageLogic";
import Header from "../../components/layout/Header";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import BookingModal from "../../components/booking/BookingModal";
import ImageZoomModal from "../../components/detail/ImageZoomModal";

const DetailActions = ({
  isFavorite,
  toggleFavorite,
  handleBookNow,
  compact = false,
}) => (
  <div className={`flex gap-2.5 ${compact ? "w-full" : "pt-2"}`}>
    <button
      type="button"
      onClick={toggleFavorite}
      aria-pressed={isFavorite}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass ${
        compact ? "flex-1" : "min-w-0 flex-1"
      } ${
        isFavorite
          ? "border-oxblood bg-oxblood/10 text-porcelain hover:bg-oxblood/20"
          : "border-porcelain/20 text-porcelain hover:border-brass hover:text-brass"
      }`}
    >
      <svg
        aria-hidden="true"
        className={`h-5 w-5 ${isFavorite ? "fill-current" : "fill-none"}`}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.7}
          d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0Z"
        />
      </svg>
      {compact ? (isFavorite ? "Saved" : "Save") : isFavorite ? "Remove from favorites" : "Add to favorites"}
    </button>
    <button
      type="button"
      onClick={handleBookNow}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-oxblood px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-porcelain transition-colors hover:bg-oxblood/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass ${
        compact ? "flex-1" : "min-w-0 flex-1"
      }`}
    >
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.7}
          d="M6.75 3.75v2.5m10.5-2.5v2.5M4.5 9h15m-13.25-4h11.5A1.75 1.75 0 0 1 19.5 6.75v12a1.75 1.75 0 0 1-1.75 1.75H6.25a1.75 1.75 0 0 1-1.75-1.75v-12A1.75 1.75 0 0 1 6.25 5Z"
        />
      </svg>
      Book now
    </button>
  </div>
);

const DetailPage = () => {
  const {
    activeTab,
    currentIndex,
    modelData,
    loading,
    isFavorite,
    mounted,
    galleryImages,
    setActiveTab,
    setCurrentIndex,
    toggleFavorite,
    navigate,
  } = useDetailPageLogic();

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [zoomedImageUrl, setZoomedImageUrl] = useState(null);

  const handleBookNow = () => setIsBookingModalOpen(true);
  const handleModalClose = () => setIsBookingModalOpen(false);
  const handleBookingSuccess = () => {};
  const handleImageZoom = (imageUrl) => setZoomedImageUrl(imageUrl);
  const handleCloseZoom = () => setZoomedImageUrl(null);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-obsidian text-porcelain">
        <LoadingSpinner message="Loading talent profile" size="large" />
      </div>
    );
  }

  if (!modelData) return null;

  const activeImage = galleryImages[currentIndex];
  const category = modelData.category || activeTab || "Talent";

  return (
    <div
      className={`min-h-screen overflow-x-hidden bg-obsidian font-sans text-porcelain transition-opacity duration-500 motion-reduce:transition-none ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="border-b border-porcelain/10 bg-ink/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-xs font-semibold uppercase tracking-[0.16em] text-taupe transition-colors hover:text-porcelain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
            Back
          </button>

          <div
            className="grid grid-cols-2 gap-1 rounded-lg bg-obsidian p-1"
            role="group"
            aria-label="Browse another talent collection"
          >
            {["LOCAL", "FOREIGN"].map((tab) => {
              const isActive = category.toLowerCase() === tab.toLowerCase();
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() =>
                    navigate("/main", { state: { activeTab: tab } })
                  }
                  aria-pressed={isActive}
                  className={`min-h-9 rounded-md px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass sm:px-5 sm:text-xs ${
                    isActive
                      ? "bg-porcelain text-obsidian"
                      : "text-taupe hover:text-porcelain"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="mx-auto grid max-w-7xl gap-8 px-3 pb-44 pt-5 sm:px-6 sm:pt-8 md:pb-16 lg:grid-cols-[minmax(0,3fr)_minmax(320px,2fr)] lg:gap-12 lg:px-8 lg:pt-10">
        <section aria-label={`${modelData.name} image gallery`}>
          <div className="relative overflow-hidden rounded-xl border border-porcelain/10 bg-ink">
            {activeImage ? (
              <button
                type="button"
                onClick={() => handleImageZoom(activeImage)}
                aria-label={`Enlarge portrait of ${modelData.name}`}
                className="group block aspect-[3/4] w-full cursor-zoom-in overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brass lg:max-h-[calc(100vh-11rem)]"
              >
                <img
                  src={activeImage}
                  alt={`${modelData.name} portfolio image ${currentIndex + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none"
                />
              </button>
            ) : (
              <div className="flex aspect-[3/4] items-center justify-center text-sm text-taupe">
                No image available
              </div>
            )}

            {galleryImages.length > 0 && (
              <span className="absolute bottom-3 right-3 rounded-md border border-porcelain/15 bg-obsidian/70 px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-porcelain backdrop-blur-md">
                {currentIndex + 1} / {galleryImages.length}
              </span>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className="mt-3 flex snap-x gap-2.5 overflow-x-auto pb-2 sm:mt-4 sm:gap-3">
              {galleryImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Show image ${index + 1} of ${galleryImages.length}`}
                  aria-pressed={currentIndex === index}
                  className={`aspect-[3/4] w-16 flex-none snap-start overflow-hidden rounded-lg border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass sm:w-20 ${
                    currentIndex === index
                      ? "border-brass"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="text-left lg:sticky lg:top-24 lg:self-start">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brass sm:text-xs">
            {category} talent
          </p>
          <h1 className="mt-3 font-serif text-5xl font-semibold leading-[0.95] text-porcelain sm:text-6xl lg:text-7xl">
            {modelData.name}
          </h1>

          <div className="mt-8 border-y border-porcelain/10 py-6">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-taupe">
              At a glance
            </p>
            <dl className="grid grid-cols-3 gap-3">
              {[
                ["Age", modelData.age],
                ["Height", modelData.height],
                ["Weight", modelData.weight],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <dt className="text-[10px] uppercase tracking-[0.14em] text-taupe">
                    {label}
                  </dt>
                  <dd className="mt-1 truncate font-serif text-xl text-porcelain sm:text-2xl">
                    {value || "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="py-7">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-brass">
              Profile
            </p>
            <p className="max-w-xl whitespace-pre-line leading-7 text-taupe">
              {modelData.about || "No description is available for this profile yet."}
            </p>
          </div>

          <div className="hidden md:block">
            <DetailActions
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
              handleBookNow={handleBookNow}
            />
          </div>
        </section>
      </main>

      <div
        className="fixed inset-x-0 z-30 border-t border-porcelain/10 bg-ink/95 px-3 py-2.5 shadow-[0_-12px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl md:hidden"
        style={{ bottom: "calc(4.375rem + env(safe-area-inset-bottom))" }}
      >
        <DetailActions
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          handleBookNow={handleBookNow}
          compact
        />
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleModalClose}
        modelData={modelData}
        onBookingSuccess={handleBookingSuccess}
      />

      <ImageZoomModal
        isOpen={Boolean(zoomedImageUrl)}
        imageUrl={zoomedImageUrl}
        altText={modelData.name}
        onClose={handleCloseZoom}
      />
    </div>
  );
};

export default DetailPage;
