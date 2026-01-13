import React from "react";
import { NavLink, Link } from "react-router-dom";

const LandingHeader = () => {
  const navLinkClasses = ({ isActive }) =>
    `relative text-sm font-semibold uppercase tracking-widest px-4 py-2 rounded-full transition-colors duration-300 group ${
      isActive ? "text-gold" : "text-white hover:text-gold"
    }`;

  return (
    <header className="absolute top-0 z-50 w-full p-6 flex justify-between items-center bg-black bg-opacity-20 backdrop-blur-sm">
      <nav className="flex items-center space-x-6">
        <NavLink to="/" className={navLinkClasses}>
          {({ isActive }) => (
            <>
              HOME
              <span
                className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gold transition-all duration-300 ${
                  isActive ? "w-1/2" : "w-0 group-hover:w-1/2"
                }`}
              ></span>
            </>
          )}
        </NavLink>
        <NavLink to="/about" className={navLinkClasses}>
          {({ isActive }) => (
            <>
              ABOUT US
              <span
                className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gold transition-all duration-300 ${
                  isActive ? "w-1/2" : "w-0 group-hover:w-1/2"
                }`}
              ></span>
            </>
          )}
        </NavLink>
      </nav>
      <Link
        to="/login"
        className="px-6 py-2 rounded-full font-semibold text-sm text-white border border-white/30 hover:bg-gold hover:text-black hover:border-gold transition-all duration-300"
      >
        Login
      </Link>
    </header>
  );
};

export default LandingHeader;
