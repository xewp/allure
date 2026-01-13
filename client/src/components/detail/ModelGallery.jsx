import React from "react";

export const ModelGallery = ({ galleryImages, currentIndex, setCurrentIndex, modelName, onImageClick }) => {
  return (
    <div className="lg:col-span-3">
      <div className="relative rounded-3xl overflow-hidden h-[600px] lg:h-[800px] border border-gold/20 shadow-elegant animate-fade-in-slow">
        {galleryImages.length > 0 ? (
          <img
            key={currentIndex}
            src={galleryImages[currentIndex]}
            alt={modelName}
            className="w-full h-full object-cover animate-fade-in cursor-pointer"
            onClick={() => onImageClick(galleryImages[currentIndex])}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-charcoal">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>

      {galleryImages.length > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`rounded-xl overflow-hidden h-20 w-20 cursor-pointer border-2 transition-all duration-300 ${
                index === currentIndex
                  ? "border-gold scale-110"
                  : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
              }`}
            >
              <img
                src={image}
                alt={`Gallery thumb ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
