import React, { useEffect } from "react";

const ImageZoomModal = ({ isOpen, imageUrl, altText, onClose }) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-obsidian/95 p-3 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Expanded image of ${altText}`}
    >
      <div
        className="relative h-full w-full"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={altText}
          className="h-full w-full object-contain"
        />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-full border border-porcelain/20 bg-obsidian/75 text-porcelain backdrop-blur-md transition-colors hover:bg-porcelain hover:text-obsidian focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass sm:right-3 sm:top-3"
          aria-label="Close image view"
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
              strokeWidth={1.8}
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ImageZoomModal;
