import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LandingHeader from "../components/LandingHeader";
import heroVideo from "../assets/About.mp4";
import Footer from "../components/Footer";

import ourmodel from "../assets/ourmodel.jpg";
import ourmodel1 from "../assets/ourmodel1.jpg";
import why1 from "../assets/why1.jpg";
import why2 from "../assets/why2.jpg";
import why3 from "../assets/why3.jpg";

const AboutPage = () => {
  const navigate = useNavigate();
  // Matches the tan/gold color from the design
  const goldColor = "#dcb887";
  // Matches the dark brown/grey background from the design
  const darkCardColor = "#4a4238";

  // Animation state for each section
  const [visibleSections, setVisibleSections] = useState(new Set());

  // Data for "Why Choose Us"
  const features = [
    {
      title: "Trained, professional talent",
      text: "At AURA SELECT, we take pride in offering trained, professional talent who understand the demands of the industry. Our models are prepared, disciplined, and capable of meeting the highest standards.",
      image: why1,
      theme: "dark",
    },
    {
      title: "VIP-ready and experienced",
      text: "At AURA SELECT, VIP-ready and experienced. Trained to handle exclusive gatherings, prestigious functions, and high-end clientele with confidence and grace.",
      image: why2,
      theme: "gold",
    },
    {
      title: "Flexible and customized services",
      text: "At AURA SELECT, we understand that every client and event is different. That's why we provide personalized arrangements, ensuring the perfect fit for your brand, theme, or occasion.",
      image: why3,
      theme: "dark",
    },
    {
      title: "Discreet and reliable",
      text: "At AURA SELECT, your event and brand are handled with the utmost professionalism. We maintain strict confidentiality and ensure our models arrive prepared, punctual, and dependable for every engagement.",
      image: why1,
      theme: "gold",
    },
  ];

  // Data for "Our Services"
  const services = [
    {
      title: "Event PR & Promotions",
      text: "Ensure your events shine with AuraSelect's PR professionals. We provide polished representatives who communicate your brand with elegance and impact.",
      theme: "gold",
    },
    {
      title: "Brand Ambassadors & Models",
      text: "Select from our curated roster of models to represent your brand at high-profile events, trade shows, and promotions.",
      theme: "dark",
    },
    {
      title: "Corporate Hosting & VIP Engagement",
      text: "Our professional hosts make every corporate event, gala, or VIP experience seamless and memorable.",
      theme: "dark",
    },
    {
      title: "Custom Requests",
      text: "We accommodate unique and tailored needs for your events, ensuring every detail is handled with elegance and professionalism.",
      theme: "gold",
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
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden snap-y snap-proximity overflow-y-scroll h-screen">
      <LandingHeader />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16 flex flex-col gap-16 md:gap-24 lg:gap-32">
        {/* --- SECTION 1: ABOUT US --- */}
        <section
          data-section="about"
          className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 snap-start min-h-screen transition-all duration-1000 ${
            visibleSections.has("about")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="rounded-3xl overflow-hidden w-full h-[50vh] md:h-[60vh] lg:h-[80vh] shadow-2xl">
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
          <div className="w-full lg:w-1/2" style={{ color: goldColor }}>
            <h2 className="text-4xl md:text-5xl font-serif italic font-bold mb-8 tracking-wide">
              ABOUT US
            </h2>
            <p className="text-lg md:text-xl font-medium italic leading-relaxed opacity-90">
              AuraSelect was founded with a single mission: to elevate every
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
          className={`flex flex-col lg:flex-row gap-12 lg:gap-20 snap-start min-h-screen transition-all duration-1000 ${
            visibleSections.has("models")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="w-full lg:w-1/2 relative min-h-[500px] md:min-h-[600px]">
            <div className="absolute top-0 right-0 w-[65%] h-[60%] z-10">
              <img
                src={ourmodel1}
                alt="Model in evening wear"
                className="w-full h-full object-cover rounded-2xl grayscale-[10%]"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-[65%] h-[55%] z-20">
              <img
                src={ourmodel}
                alt="Model poolside"
                className="w-full h-full object-cover rounded-2xl grayscale-[10%]"
              />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <div
                className="rounded-full w-24 h-24 md:w-32 md:h-32 flex flex-col items-center justify-center text-center shadow-xl border border-white/10"
                style={{ backgroundColor: darkCardColor }}
              >
                <span
                  className="text-xl md:text-2xl font-bold italic"
                  style={{ color: goldColor }}
                >
                  50+
                </span>
                <span className="text-xs md:text-sm tracking-widest uppercase text-white/80">
                  Models
                </span>
              </div>
            </div>
          </div>

          <div
            className="w-full lg:w-1/2 flex flex-col justify-between py-4"
            style={{ color: goldColor }}
          >
            <div className="mb-12 lg:pl-10">
              <h2 className="text-4xl md:text-5xl font-serif italic font-bold mb-6 tracking-wide text-right lg:text-left">
                OUR MODELS
              </h2>
              <p className="text-lg md:text-xl font-medium italic opacity-90 text-right lg:text-left max-w-md ml-auto lg:ml-0">
                Professional PR ladies and models for exclusive events, brand
                promotions, and VIP experiences.
              </p>
            </div>
            <div className="lg:pl-10">
              <p className="text-base md:text-lg font-medium italic leading-relaxed opacity-80 text-justify md:text-left">
                We understand that every event is more than just a
                gathering—it’s an opportunity to create an impression that
                lasts. That’s why we carefully curate a team of highly trained
                PR ladies and models who embody sophistication, poise, and
                professionalism. Each member of our roster is selected not only
                for their presence but for their ability to represent your brand
                with authenticity and grace.
              </p>
            </div>
          </div>
        </section>

        {/* --- SECTION 3: WHY CHOOSE US --- */}
        <section
          data-section="why"
          className={`flex flex-col gap-16 snap-start min-h-screen transition-all duration-1000 ${
            visibleSections.has("why")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h2
            className="text-4xl md:text-5xl font-serif italic font-bold text-center tracking-wide"
            style={{ color: goldColor }}
          >
            WHY CHOOSE US?
          </h2>

          <div className="flex flex-col gap-8 md:gap-10 lg:gap-12">
            {features.map((feature, index) => {
              const isEven = index % 2 === 0;
              const flexDirection = isEven
                ? "md:flex-row"
                : "md:flex-row-reverse";
              const isDarkTheme = feature.theme === "dark";
              const cardBg = isDarkTheme ? darkCardColor : goldColor;
              const titleColor = isDarkTheme ? goldColor : "black";
              const textColor = isDarkTheme ? "rgba(255,255,255,0.8)" : "black";

              return (
                <div
                  key={index}
                  className={`flex flex-col ${flexDirection} items-stretch gap-6 md:gap-8`}
                >
                  <div className="w-full md:w-1/4 flex-shrink-0">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-64 md:h-full object-cover rounded-2xl shadow-lg"
                    />
                  </div>
                  <div
                    className="w-full md:w-3/4 p-8 md:p-12 rounded-2xl flex flex-col justify-center shadow-md"
                    style={{ backgroundColor: cardBg }}
                  >
                    <h3
                      className="text-2xl md:text-3xl font-serif italic font-bold mb-4"
                      style={{ color: titleColor }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className="text-base md:text-lg italic font-medium leading-relaxed"
                      style={{ color: textColor }}
                    >
                      {feature.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* --- SECTION 4: OUR SERVICES (NEW) --- */}
        <section
          data-section="services"
          className={`flex flex-col items-center gap-16 pb-20 snap-start min-h-screen transition-all duration-1000 ${
            visibleSections.has("services")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          {/* Header */}
          <div className="text-center space-y-4" style={{ color: goldColor }}>
            <h2 className="text-4xl md:text-5xl font-serif italic font-bold tracking-wide">
              OUR SERVICES
            </h2>
            <p className="text-xl md:text-3xl font-serif italic font-bold max-w-2xl mx-auto leading-tight">
              PR models that elevate your brand presence.
            </p>
          </div>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {services.map((service, index) => {
              const isDarkTheme = service.theme === "dark";
              const cardBg = isDarkTheme ? darkCardColor : goldColor;
              const titleColor = isDarkTheme ? goldColor : "black";
              const textColor = isDarkTheme ? "rgba(255,255,255,0.8)" : "black";

              return (
                <div
                  key={index}
                  className="p-8 md:p-12 rounded-2xl flex flex-col gap-4 shadow-lg min-h-[300px]"
                  style={{ backgroundColor: cardBg }}
                >
                  <h3
                    className="text-2xl md:text-3xl font-serif italic font-bold"
                    style={{ color: titleColor }}
                  >
                    {service.title}
                  </h3>

                  {/* Bullet point handling: The text looks like a list item in the design */}
                  <div className="flex gap-3">
                    <span className="text-lg pt-1" style={{ color: textColor }}>
                      •
                    </span>
                    <p
                      className="text-base md:text-lg italic font-medium leading-relaxed"
                      style={{ color: textColor }}
                    >
                      {service.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Book Now Button */}
          <button
            onClick={() => navigate("/login")}
            className="mt-8 bg-white text-black px-10 py-3 rounded-full font-serif italic text-lg md:text-xl font-bold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            Book now
          </button>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
