import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * AuthLayout - Shared layout component for authentication pages (Login/Register)
 * Features:
 * - Diagonal cut black/tan design
 * - POWER ALLURE branding section
 * - Intersection Observer animations
 * - Responsive layout
 */
const AuthLayout = ({ children, title, leftSectionStyle = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [visibleSections, setVisibleSections] = useState(new Set());

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px",
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

    const sections = document.querySelectorAll("[data-section]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Default left section styling (can be overridden for login vs register)
  const defaultLeftStyle = {
    justifyContent: "justify-start pt-20 md:pt-32",
    paddingX: "px-4 md:px-0",
    marginLeft: "md:-ml-36",
    headingSize: "text-[70px] md:text-[90px]",
    subheadingSize: "text-xl md:text-2xl",
  };

  const mergedStyle = { ...defaultLeftStyle, ...leftSectionStyle };

  return (
    <div className="flex h-screen w-full bg-[#D8AF7F]">
      {/* Left Section with Blueish Gradient Background and Diagonal Cut - Hidden on Mobile */}
      <div
        data-section="left"
        className={`hidden md:flex relative md:w-1/2 h-full bg-gradient-to-br from-black via-gray-900 to-black flex-col ${
          mergedStyle.justifyContent
        } ${mergedStyle.paddingX} ${
          mergedStyle.marginLeft
        } z-10 transition-all duration-1000 ${
          visibleSections.has("left")
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-10"
        }`}
        style={{ clipPath: "polygon(0 0, 100% 0, 60% 100%, 0 100%)" }}
      >
        <h1
          className={`font-serif ${mergedStyle.headingSize} font-bold mb-4 leading-tight bg-gradient-to-r from-gold-light to-gold bg-clip-text text-transparent`}
        >
          POWER ALLURE
        </h1>
        <p
          className={`text-gold ${mergedStyle.subheadingSize} font-light tracking-wide`}
        >
          Feel the power. Own the allure
          {/* Hidden Easter egg: clickable period only on login page */}
          {location.pathname === "/login" ? (
            <span
              onClick={() => navigate("/register")}
              className="cursor-pointer hover:text-gold-light transition-colors duration-300"
              title="Psst... click me!"
            >
              .
            </span>
          ) : (
            <span>.</span>
          )}
        </p>
      </div>

      {/* Right Section with Tan Background and Form Content */}
      <div className="w-full md:w-auto md:absolute md:inset-0 flex md:justify-end justify-center items-center z-0">
        <div
          data-section="right"
          className={`w-full md:w-1/2 flex flex-col items-center px-4 md:px-8 py-8 transition-all duration-1000 delay-300 overflow-y-auto max-h-screen ${
            visibleSections.has("right")
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-10"
          }`}
        >
          {title && (
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 md:mb-8 text-black">
              {title}
            </h2>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
