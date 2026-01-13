import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LandingHeader from "../../components/layout/LandingHeader";
import heroVideo from "../../assets/Landing.mp4";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black font-sans relative overflow-hidden">
      {/* Header */}
      <LandingHeader />

      {/* Hero Section */}
      <main className="relative min-h-screen flex items-center justify-center">
        {/* Background Video with Overlay */}
        <div className="absolute inset-0 z-0">
          <video
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40"
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
        </div>

        {/* Content */}
        <div
          className={`relative z-10 text-center px-4 max-w-6xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Main Headline */}
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-bold mb-6 bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent leading-tight tracking-tight">
            POWER ALLURE
          </h1>

          {/* Tagline */}
          <p className="text-gold-light text-xl md:text-2xl lg:text-3xl font-light tracking-[0.3em] mb-4 opacity-90">
            ELEGANCE · SOPHISTICATION · EXCELLENCE
          </p>

          {/* Description */}
          <p className="text-gray-300 text-base md:text-lg lg:text-xl max-w-3xl mx-auto mb-12 leading-relaxed font-light px-4 opacity-80">
            Your gateway to discovering exceptional talent. Experience the
            perfect blend of professionalism, charisma, and elegance for your
            exclusive events.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigate("/main")}
            className="group relative inline-flex items-center gap-3 px-10 py-4 bg-gold text-black font-semibold text-lg rounded-full overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-gold-lg"
          >
            <span className="relative z-10">Explore Models</span>
            <svg
              className="w-5 h-5 relative z-10 transition-transform duration-500 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </main>

      {/* Secondary Content Section */}
      <section className="relative z-10 bg-gradient-to-b from-black to-charcoal py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-gold mb-6 font-bold">
            Discover Fresh Faces, Standout Talent
          </h2>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-12">
            Browse through our curated roster of professional models, each
            bringing unique style, personality, and expertise. Whether you seek
            elegance, edge, or effortless charm, find the perfect fit for your
            creative vision.
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="p-8 bg-warm-gray/30 rounded-2xl backdrop-blur-sm border border-gold/10 hover:border-gold/30 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-gold font-semibold text-xl mb-2">
                50+ Professional Models
              </h3>
              <p className="text-gray-400">
                Diverse roster of trained, experienced talent
              </p>
            </div>

            <div className="p-8 bg-warm-gray/30 rounded-2xl backdrop-blur-sm border border-gold/10 hover:border-gold/30 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-gold font-semibold text-xl mb-2">
                VIP-Ready Service
              </h3>
              <p className="text-gray-400">
                Trained for exclusive events and high-profile clientele
              </p>
            </div>

            <div className="p-8 bg-warm-gray/30 rounded-2xl backdrop-blur-sm border border-gold/10 hover:border-gold/30 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-gold font-semibold text-xl mb-2">
                Flexible Booking
              </h3>
              <p className="text-gray-400">
                Customized arrangements for any occasion
              </p>
            </div>
          </div>

          {/* Secondary CTA */}
          <button
            onClick={() => navigate("/about")}
            className="mt-16 px-8 py-3 border-2 border-gold text-gold font-semibold rounded-full hover:bg-gold hover:text-black transition-all duration-300"
          >
            Learn More About Us
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
