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
const AuthLayout = ({
  children,
  title,
  leftSectionStyle = {},
  titleClassName = "",
}) => {
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
            (prev) => new Set([...prev, entry.target.dataset.section]),
          );
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
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
    <div className="flex h-screen w-full bg-black">
      {/* Left Section with Gradient Background and Rounded Corners - Hidden on Mobile */}
      <div
        data-section="left"
        className={`hidden md:flex relative md:w-1/2 h-full bg-gradient-to-b from-[#3a3a3a] via-[#5a5a5a] to-[#D8AF7F] flex-col justify-between p-8 md:p-10 z-10 transition-all duration-1000 rounded-3xl m-6 ${
          visibleSections.has("left")
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-10"
        }`}
      >
        <h1
          className={`font-serif text-3xl md:text-4xl font-normal leading-tight text-[#D8AF7F]`}
        >
          Power Allure
        </h1>
        <p className={`text-2xl md:text-3xl tracking-wide`}>
          <span className="text-black font-bold">Feel The</span>{" "}
          <span className="text-black/60 font-light">Power.</span>
          <br />
          <span className="text-black font-bold">Own The</span>{" "}
          <span className="text-black/60 font-light">Allure</span>
          {/* Hidden Easter egg: clickable period on login page */}
          {location.pathname === "/login" ? (
            <span
              onClick={() => navigate("/register")}
              className="cursor-pointer hover:text-black transition-colors duration-300 text-black/60 font-light"
              title="Psst... click me!"
            >
              .
            </span>
          ) : (
            <span className="text-black/60 font-light">.</span>
          )}
        </p>
      </div>

      {/* Right Section with Tan Background and Form Content */}
      <div className="w-full md:w-auto md:absolute md:inset-0 flex md:justify-end justify-center items-center z-0 bg-black">
        <div
          data-section="right"
          className={`w-full md:w-1/2 flex flex-col items-center px-4 md:px-8 py-8 transition-all duration-1000 delay-300 overflow-y-auto max-h-screen ${
            visibleSections.has("right")
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-10"
          }`}
        >
          {title && (
            <h2
              className={`font-serif text-4xl md:text-5xl font-bold mb-6 md:mb-8 ${titleClassName || "text-black"}`}
            >
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
