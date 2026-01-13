import React from "react";

const ImageZoomModal = ({ isOpen, imageUrl, altText, onClose }) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div className="relative w-screen h-screen p-4 md:p-8" onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt={altText} className="w-full h-full object-contain rounded-lg" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"
          aria-label="Close image view"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ImageZoomModal;
