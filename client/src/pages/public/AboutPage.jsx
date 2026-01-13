import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LandingHeader from "../../components/layout/LandingHeader";
import heroVideo from "../../assets/About.mp4";
import ourModel from "../../assets/ourmodel.jpg";
import ourModel1 from "../../assets/ourmodel1.jpg";
import why from "../../assets/why.jpg";
import why1 from "../../assets/why1.jpg";
import why2 from "../../assets/why2.jpg";
import Footer from "../../components/layout/Footer";

const AboutPage = () => {
  const navigate = useNavigate();

  // Animation state for each section
  const [visibleSections, setVisibleSections] = useState(new Set());

  // Data for "Why Choose Us"
  const features = [
    {
      title: "Trained, professional talent",
      text: "At POWER ALLURE, we take pride in offering trained, professional talent who understand the demands of the industry. Our models are prepared, disciplined, and capable of meeting the highest standards.",
      image: why,
    },
    {
      title: "VIP-ready and experienced",
      text: "At POWER ALLURE, VIP-ready and experienced. Trained to handle exclusive gatherings, prestigious functions, and high-end clientele with confidence and grace.",
      image: why1,
    },
    {
      title: "Discreet and reliable",
      text: "At POWER ALLURE, your event and brand are handled with the utmost professionalism. We maintain strict confidentiality and ensure our models arrive prepared, punctual, and dependable for every engagement.",
      image: why2,
    },
  ];

  // Data for "Our Services"
  const services = [
    {
      title: "Event PR & Promotions",
      text: "Ensure your events shine with PowerAllure's PR professionals. We provide polished representatives who communicate your brand with elegance and impact.",
    },
    {
      title: "Brand Ambassadors & Models",
      text: "Select from our curated roster of models to represent your brand at high-profile events, trade shows, and promotions.",
    },
    {
      title: "Corporate Hosting & VIP Engagement",
      text: "Our professional hosts make every corporate event, gala, or VIP experience seamless and memorable.",
    },
    {
      title: "Custom Requests",
      text: "We accommodate unique and tailored needs for your events, ensuring every detail is handled with elegance and professionalism.",
    },
  ];

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections(
            (prev) => new Set([...prev, entry.target.dataset.section])
          );
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Observe all sections
    const sections = document.querySelectorAll("[data-section]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white font-sans">
      <LandingHeader />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24 flex flex-col gap-24 md:gap-32">
        {/* --- SECTION 1: ABOUT US --- */}
        <section
          data-section="about"
          className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 transition-all duration-1000 ${
            visibleSections.has("about")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="rounded-3xl overflow-hidden w-full h-[60vh] lg:h-[70vh] shadow-gold">
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
          <div className="w-full lg:w-1/2 text-gold-light">
            <h2 className="font-serif text-5xl md:text-6xl font-bold mb-6 tracking-wide bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
              ABOUT US
            </h2>
            <p className="text-lg md:text-xl font-light leading-relaxed text-gray-300">
              PowerAllure was founded with a single mission: to elevate every
              event, brand, and experience through elegance, professionalism,
              and charisma. What started as a vision to provide premium talent
              for high-profile events quickly became a trusted partner for
              companies and individuals seeking the perfect representation for
              their brand.
            </p>
          </div>
        </section>

        {/* --- SECTION 2: OUR MODELS --- */}
        <section
          data-section="models"
          className={`flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16 transition-all duration-1000 ${
            visibleSections.has("models")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="w-full lg:w-1/2 relative min-h-[500px] md:min-h-[600px]">
            <div className="absolute top-0 left-0 w-[65%] h-[60%] z-10 rounded-2xl overflow-hidden shadow-elegant">
              <img
                src={ourModel}
                alt="Power Allure Model"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-[65%] h-[55%] z-20 rounded-2xl overflow-hidden shadow-elegant">
              <img
                src={ourModel1}
                alt="Power Allure Model"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <div className="rounded-full w-28 h-28 md:w-32 md:h-32 flex flex-col items-center justify-center text-center bg-charcoal border border-gold/20 shadow-gold">
                <span className="text-gold text-2xl md:text-3xl font-bold font-serif">
                  50+
                </span>
                <span className="text-xs md:text-sm tracking-widest uppercase text-gray-300">
                  Models
                </span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col justify-center text-gold-light">
            <div className="mb-8">
              <h2 className="font-serif text-5xl md:text-6xl font-bold mb-6 tracking-wide bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
                OUR MODELS
              </h2>
              <p className="text-lg md:text-xl font-light text-gray-300 max-w-md">
                Professional PR ladies and models for exclusive events, brand
                promotions, and VIP experiences.
              </p>
            </div>
            <div>
              <p className="text-base md:text-lg font-light leading-relaxed text-gray-400">
                We understand that every event is more than just a
                gathering—it’s an opportunity to create an impression that
                lasts. That’s why we carefully curate a team of highly trained
                PR ladies and models who embody sophistication, poise, and
                professionalism.
              </p>
            </div>
          </div>
        </section>

        {/* --- SECTION 3: WHY CHOOSE US --- */}
        <section
          data-section="why"
          className={`flex flex-col gap-12 transition-all duration-1000 ${
            visibleSections.has("why")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-center tracking-wide bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
            WHY CHOOSE US?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-warm-gray/30 rounded-2xl backdrop-blur-sm border border-gold/10 hover:border-gold/30 transition-all duration-300"
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-48 object-cover rounded-xl mb-6 shadow-lg"
                />
                <h3 className="text-gold font-semibold text-xl mb-2 font-serif">
                  {feature.title}
                </h3>
                <p className="text-gray-400 font-sans">{feature.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECTION 4: OUR SERVICES --- */}
        <section
          data-section="services"
          className={`flex flex-col items-center gap-12 transition-all duration-1000 ${
            visibleSections.has("services")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center">
            <h2 className="font-serif text-5xl md:text-6xl font-bold tracking-wide bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
              OUR SERVICES
            </h2>
            <p className="text-gold-light text-xl md:text-2xl font-light mt-2">
              PR models that elevate your brand presence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            {services.map((service, index) => (
              <div
                key={index}
                className="p-8 bg-charcoal rounded-2xl flex flex-col gap-4 border border-gold/20 shadow-elegant"
              >
                <h3 className="text-2xl font-serif font-bold text-gold">
                  {service.title}
                </h3>
                <p className="text-gray-300 font-sans leading-relaxed">
                  {service.text}
                </p>
              </div>
            ))}
          </div>

          {/* Book Now Button */}
          <button
            onClick={() => {
              const token = localStorage.getItem("token");
              if (token) {
                navigate("/booking");
              } else {
                navigate("/login");
              }
            }}
            className="group relative inline-flex items-center gap-3 px-10 py-4 bg-gold text-black font-semibold text-lg rounded-full overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-gold-lg mt-8"
          >
            <span className="relative z-10">Book Now</span>
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
            <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </button>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
