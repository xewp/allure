import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDetailPageLogic } from "../../hooks/useDetailPageLogic";
import Header from "../../components/layout/Header";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import BookingModal from "../../components/booking/BookingModal";
import ImageZoomModal from "../../components/detail/ImageZoomModal";

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

  const navigateInstance = useNavigate();

  // Booking modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  // Zoom modal state
  const [zoomedImageUrl, setZoomedImageUrl] = useState(null);

  const handleBookNow = () => {
    setIsBookingModalOpen(true);
  };

  const handleModalClose = () => {
    setIsBookingModalOpen(false);
  };

  const handleBookingSuccess = (booking) => {

  };

  const handleImageZoom = (imageUrl) => {
    setZoomedImageUrl(imageUrl);
  };

  const handleCloseZoom = () => {
    setZoomedImageUrl(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <LoadingSpinner message="Loading model details" size="large" />
      </div>
    );
  }

  if (!modelData) return null;

  return (
    <div
      className={`min-h-screen bg-black text-white font-sans transition-opacity duration-500 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Header */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* LOCAL/FOREIGN Tabs - Top Center */}
      <div className="flex justify-center pt-6 pb-4">
        <div className="flex gap-4">
          <button
            onClick={() =>
              navigateInstance("/main", { state: { activeTab: "LOCAL" } })
            }
            className={`px-8 py-2 rounded-md font-medium uppercase text-sm tracking-wider transition-all duration-300 ${
              modelData.category?.toLowerCase() === "local"
                ? "border-2 border-[#D8AF7F] bg-white text-black"
                : "border-2 border-[#D8AF7F] text-[#D8AF7F] hover:bg-[#D8AF7F]/10"
            }`}
          >
            LOCAL
          </button>
          <button
            onClick={() =>
              navigateInstance("/main", { state: { activeTab: "FOREIGN" } })
            }
            className={`px-8 py-2 rounded-md font-medium uppercase text-sm tracking-wider transition-all duration-300 ${
              modelData.category?.toLowerCase() === "foreign"
                ? "border-2 border-[#D8AF7F] bg-white text-black"
                : "border-2 border-[#D8AF7F] text-[#D8AF7F] hover:bg-[#D8AF7F]/10"
            }`}
          >
            FOREIGN
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button - Far Left */}
        <div className="mb-8 flex">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 border-2 border-[#D8AF7F] text-[#D8AF7F] rounded-md font-medium uppercase text-sm hover:bg-[#D8AF7F] hover:text-black transition-all duration-300"
          >
            Back
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden border-2 border-[#D8AF7F]/30">
              <img
                src={galleryImages[currentIndex]}
                alt={modelData.name}
                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => handleImageZoom(galleryImages[currentIndex])}
              />
            </div>

            {/* Thumbnail Images - Centered */}
            <div className="flex gap-4 overflow-x-auto pb-2 justify-center">
              {galleryImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 w-20 h-28 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    currentIndex === index
                      ? "border-[#D8AF7F] scale-105"
                      : "border-transparent hover:border-[#D8AF7F]/50"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${modelData.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Model Details */}
          <div className="space-y-6">
            {/* Model Name */}
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#D8AF7F]">
              {modelData.name}
            </h1>

            {/* Stats Section */}
            <div className="border-2 border-[#D8AF7F] rounded-lg p-6">
              <h2 className="font-serif text-2xl font-bold text-[#D8AF7F] mb-4 text-center">
                Stats
              </h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Age</p>
                  <p className="text-white font-semibold text-lg">
                    {modelData.age || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Weight</p>
                  <p className="text-white font-semibold text-lg">
                    {modelData.weight || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Height</p>
                  <p className="text-white font-semibold text-lg">
                    {modelData.height || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="border-2 border-[#D8AF7F] rounded-lg p-6">
              <h2 className="font-serif text-2xl font-bold text-[#D8AF7F] mb-4 text-center">
                About
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {modelData.about || "No description available."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={toggleFavorite}
                className={`flex-1 px-6 py-3 border-2 rounded-md font-medium uppercase text-sm tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                  isFavorite
                    ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    : "border-[#D8AF7F] text-[#D8AF7F] hover:bg-[#D8AF7F] hover:text-black"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill={isFavorite ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {isFavorite ? "Remove from Favorites" : "Add To Favorites"}
              </button>
              <button
                onClick={handleBookNow}
                className="flex-1 px-6 py-3 border-2 border-[#D8AF7F] text-[#D8AF7F] rounded-md font-medium uppercase text-sm tracking-wider hover:bg-[#D8AF7F] hover:text-black transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Book Now
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleModalClose}
        modelData={modelData}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Image Zoom Modal */}
      <ImageZoomModal
        isOpen={!!zoomedImageUrl}
        imageUrl={zoomedImageUrl}
        altText={modelData.name}
        onClose={handleCloseZoom}
      />
    </div>
  );
};

export default DetailPage;
