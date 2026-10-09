import React from "react";

const LoadingSpinner = ({ message = "Loading...", size = "default" }) => {
  const sizeClasses = {
    small: "w-2 h-2",
    default: "w-3 h-3",
    large: "w-4 h-4",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5" role="status" aria-live="polite">
      <div className="flex items-center justify-center space-x-2" aria-hidden="true">
        <div
          className={`${sizeClasses[size]} animate-elegant-spinner rounded-full bg-oxblood`}
          style={{ animationDelay: "-0.32s" }}
        ></div>
        <div
          className={`${sizeClasses[size]} animate-elegant-spinner rounded-full bg-brass`}
          style={{ animationDelay: "-0.16s" }}
        ></div>
        <div
          className={`${sizeClasses[size]} animate-elegant-spinner rounded-full bg-porcelain`}
        ></div>
      </div>

      {message && (
        <p className="text-sm font-medium tracking-[0.12em] text-taupe">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
