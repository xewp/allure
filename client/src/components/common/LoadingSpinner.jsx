import React from "react";

const LoadingSpinner = ({ message = "Loading...", size = "default" }) => {
  const sizeClasses = {
    small: "w-2 h-2",
    default: "w-3 h-3",
    large: "w-4 h-4",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Spinner */}
      <div className="flex items-center justify-center space-x-2">
        <div
          className={`${sizeClasses[size]} bg-gold rounded-full animate-elegant-spinner`}
          style={{ animationDelay: "-0.32s" }}
        ></div>
        <div
          className={`${sizeClasses[size]} bg-gold rounded-full animate-elegant-spinner`}
          style={{ animationDelay: "-0.16s" }}
        ></div>
        <div
          className={`${sizeClasses[size]} bg-gold rounded-full animate-elegant-spinner`}
        ></div>
      </div>

      {/* Loading text */}
      {message && (
        <p className="text-gold text-lg font-medium tracking-wider">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
