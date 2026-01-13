import React, { useState } from "react";
import Header from "../../components/layout/Header";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useDetailPageLogic } from "../../hooks/useDetailPageLogic";
import { ModelGallery } from "../../components/detail/ModelGallery";
import { ModelDetails } from "../../components/detail/ModelDetails";
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
    console.log("Booking created successfully:", booking);
    // You can add additional success handling here, like showing a toast notification
  };

  const handleImageZoom = (imageUrl) => {
    setZoomedImageUrl(imageUrl);
  };

  const handleCloseZoom = () => {
    setZoomedImageUrl(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
        <LoadingSpinner message="Loading model details" size="large" />
      </div>
    );
  }

  if (!modelData) return null;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white font-sans relative overflow-hidden transition-opacity duration-500 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-gold/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-gold/10 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-300 hover:text-gold transition-colors duration-300 group"
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <ModelGallery
            galleryImages={galleryImages}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            modelName={modelData.name}
            onImageClick={handleImageZoom}
          />
          <ModelDetails
            modelData={modelData}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            onBookNow={handleBookNow}
          />
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
