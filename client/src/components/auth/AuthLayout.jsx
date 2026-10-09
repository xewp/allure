import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * AuthLayout - Shared layout component for authentication pages (Login/Register)
 * Features:
 * - Editorial split design
 * - VELORA branding section
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
    <div className="flex min-h-screen w-full bg-porcelain text-obsidian">
      <div
        data-section="left"
        data-heading-scale={mergedStyle.headingSize}
        className={`relative z-10 hidden min-h-screen w-1/2 flex-col justify-between overflow-hidden border-r border-porcelain/10 bg-ink p-10 transition-all duration-700 md:flex lg:p-16 ${
          visibleSections.has("left")
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-10"
        }`}
      >
        <h1
          className="font-serif text-4xl font-normal leading-tight tracking-[0.14em] text-porcelain"
        >
          VELORA
        </h1>
        <p className="font-serif text-4xl leading-tight text-porcelain lg:text-5xl">
          <span>Curated talent.</span>
          <br />
          <span className="text-brass">Unforgettable presence</span>
          {location.pathname === "/login" ? (
            <span
              onClick={() => navigate("/register")}
              className="cursor-pointer text-brass transition-colors duration-300 hover:text-brass-light"
              title="Create an account"
            >
              .
            </span>
          ) : (
            <span className="text-brass">.</span>
          )}
        </p>
      </div>

      <div className="z-0 flex min-h-screen w-full items-center justify-center bg-porcelain md:absolute md:inset-0 md:w-auto md:justify-end">
        <div
          data-section="right"
          className={`flex w-full flex-col items-center overflow-y-auto px-5 py-10 transition-all duration-700 delay-200 md:max-h-screen md:w-1/2 md:px-10 ${
            visibleSections.has("right")
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-10"
          }`}
        >
          {title && (
            <h2
              className={`mb-6 font-serif text-4xl font-normal md:mb-8 md:text-5xl ${titleClassName || "text-obsidian"}`}
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
