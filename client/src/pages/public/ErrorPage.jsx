import React, { useState, useEffect } from "react";

const ErrorPage = () => {
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setVisibleSections(new Set(["content"]));
    }, 100);

    return () => {
      clearTimeout(timer1);
    };
  }, []);

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="flex justify-center items-center h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      <div
        className={`flex flex-col items-center transition-all duration-1000 ${
          visibleSections.has("content")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        {/* Floating Animated Icon */}
        <div className="relative mb-12">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="w-40 h-40 border-4 border-[#D8AF7F] rounded-full animate-spin-slow opacity-30"></div>
          </div>

          {/* Middle pulsing ring */}
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="w-32 h-32 border-4 border-[#D8AF7F] rounded-full animate-pulse-ring"></div>
          </div>

          {/* Center content */}
          <div className="relative w-40 h-40 flex flex-col justify-center items-center">
            <div className="text-[#D8AF7F] text-7xl font-bold animate-glitch">
              404
            </div>
            <div className="w-16 h-1 bg-[#D8AF7F] mt-2 animate-expand-contract"></div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-[#D8AF7F] text-5xl font-bold mb-4 animate-fade-slide-up">
          Lost in the Void
        </h1>
        <p className="text-[#D8AF7F] text-lg mb-8 text-center max-w-md animate-fade-slide-up-delay">
          The page you seek has vanished into darkness.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 animate-fade-slide-up-delay-2">
          <button
            onClick={handleGoBack}
            className="px-8 py-3 rounded-full bg-[#D8AF7F] text-black font-semibold transition-all hover:bg-[#c5c4c4] hover:scale-105 active:scale-95"
          >
            Go Back
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-8 py-3 rounded-full border-2 border-[#D8AF7F] text-[#D8AF7F] font-semibold transition-all hover:bg-[#D8AF7F] hover:text-black hover:scale-105 active:scale-95"
          >
            Home
          </button>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
          <div className="particle particle-6"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-ring {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        @keyframes glitch {
          0%,
          90%,
          100% {
            transform: translateX(0);
            text-shadow: 0 0 10px rgba(216, 175, 127, 0.5);
          }
          92% {
            transform: translateX(-3px);
            text-shadow: -3px 0 10px rgba(216, 175, 127, 0.8);
          }
          94% {
            transform: translateX(3px);
            text-shadow: 3px 0 10px rgba(216, 175, 127, 0.8);
          }
          96% {
            transform: translateX(-2px);
          }
        }

        @keyframes expand-contract {
          0%,
          100% {
            width: 4rem;
            opacity: 1;
          }
          50% {
            width: 6rem;
            opacity: 0.6;
          }
        }

        @keyframes fade-slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float-particle {
          0% {
            transform: translateY(100vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh) translateX(100px) rotate(360deg);
            opacity: 0;
          }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-pulse-ring {
          animation: pulse-ring 2s ease-in-out infinite;
        }

        .animate-glitch {
          animation: glitch 3s ease-in-out infinite;
        }

        .animate-expand-contract {
          animation: expand-contract 2s ease-in-out infinite;
        }

        .animate-fade-slide-up {
          animation: fade-slide-up 0.8s ease-out 0.4s both;
        }

        .animate-fade-slide-up-delay {
          animation: fade-slide-up 0.8s ease-out 0.6s both;
        }

        .animate-fade-slide-up-delay-2 {
          animation: fade-slide-up 0.8s ease-out 0.8s both;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #d8af7f;
          border-radius: 50%;
          opacity: 0;
        }

        .particle-1 {
          left: 10%;
          animation: float-particle 15s ease-in-out infinite;
        }

        .particle-2 {
          left: 25%;
          animation: float-particle 18s ease-in-out infinite 2s;
        }

        .particle-3 {
          left: 40%;
          animation: float-particle 20s ease-in-out infinite 4s;
        }

        .particle-4 {
          left: 60%;
          animation: float-particle 17s ease-in-out infinite 1s;
        }

        .particle-5 {
          left: 75%;
          animation: float-particle 19s ease-in-out infinite 3s;
        }

        .particle-6 {
          left: 90%;
          animation: float-particle 16s ease-in-out infinite 5s;
        }
      `}</style>
    </div>
  );
};

export default ErrorPage;
