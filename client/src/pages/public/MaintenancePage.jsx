import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * MaintenancePage - Displays a maintenance mode message
 * Shows when the system is in maintenance mode
 */
const MaintenancePage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Countdown timer to retry
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.reload(); // Retry by reloading
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      <div className="text-center px-6 py-12 max-w-2xl">
        <div className="mb-8">
          <div className="text-8xl mb-4">🔧</div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#d6b48e] mb-4">
            Under Maintenance
          </h1>
        </div>

        <p className="text-xl md:text-2xl text-white mb-8">
          We're currently performing scheduled maintenance to improve your
          experience.
        </p>

        <p className="text-lg text-gray-300 mb-8">
          Our team is working hard to get everything back up and running.
          <br />
          Please check back soon!
        </p>

        <div className="bg-white/10 rounded-2xl p-6 mb-8">
          <p className="text-white text-lg">
            Automatically retrying in{" "}
            <span className="font-bold text-[#d6b48e] text-2xl">
              {countdown}
            </span>{" "}
            seconds...
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 rounded-full bg-[#d6b48e] text-black font-semibold transition-all hover:scale-105 hover:shadow-lg"
        >
          Try Again Now
        </button>

        <p className="text-gray-400 text-sm mt-8">
          If the issue persists, please contact our support team.
        </p>
      </div>
    </div>
  );
};

export default MaintenancePage;
