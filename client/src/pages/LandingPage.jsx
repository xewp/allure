import React from "react";
import LandingHeader from "../components/LandingHeader";
import heroVideo from "../assets/Landing.mp4"; // Ensure your video is at this path

const LandingPage = () => {
  const themeColor = "#d6b48e"; // Tan/Gold color

  return (
    <div className="min-h-screen bg-black font-sans">
      {/* Header */}
      <LandingHeader />

      {/* Main Content */}
      <main className="flex flex-col lg:flex-row items-start justify-between pt-8 px-4 md:pt-16 md:px-8 lg:pt-24 lg:pl-16 lg:pr-8">
        {/* Left Section: Text Content */}
        <div className="lg:w-2/3 text-left mb-8 md:mb-12 lg:mb-0 lg:pr-8">
          <h1
            className="text-4xl md:text-6xl lg:text-9xl font-bold mb-4 md:mb-6 leading-tight animate-fade-in-up"
            style={{ color: themeColor }}
          >
            Welcome to
            <br />
            Aura Select
          </h1>
          <p
            className="text-base md:text-xl lg:text-4xl mb-6 md:mb-8 max-w-4xl font-extralight animate-fade-in-up animation-delay-300"
            style={{ color: themeColor }}
          >
            Your gateway to discovering fresh faces and standout talent. Browse
            through our diverse roster of models, each with their own unique
            look, style, and personality. Whether you're searching for elegance,
            edge, or effortless charm, you'll find the perfect fit for your
            creative vision here.
          </p>
          <button
            className="px-6 md:px-8 py-2 md:py-3 rounded-full text-black font-bold text-base md:text-lg hover:bg-opacity-80 transition-all transform hover:scale-105 animate-fade-in-up animation-delay-600"
            style={{ backgroundColor: themeColor }}
          >
            Get Started
          </button>
        </div>

        {/* Right Section: Video */}
        <div className="lg:w-1/3 w-full flex justify-center lg:justify-start lg:pl-12">
          <div
            className="rounded-3xl overflow-hidden border-4 w-full md:w-9/12 h-[300px] md:h-[500px] lg:h-[700px] shadow-2xl"
            style={{ borderColor: themeColor }}
          >
            <video
              src={heroVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
