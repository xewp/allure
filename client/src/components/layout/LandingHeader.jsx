import React from "react";
import { Link, NavLink } from "react-router-dom";

const LandingHeader = () => {
  const navLinkClasses = ({ isActive }) =>
    `relative inline-flex min-h-11 items-center px-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] transition-colors focus:outline-none focus:ring-2 focus:ring-brass focus:ring-offset-2 focus:ring-offset-obsidian sm:text-xs ${
      isActive ? "text-brass" : "text-porcelain/75 hover:text-porcelain"
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-porcelain/10 bg-obsidian/90 text-porcelain backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-3 px-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          aria-label="Velora home"
          className="group inline-flex min-w-0 items-center gap-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brass focus:ring-offset-2 focus:ring-offset-obsidian"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-brass/70 font-serif text-xl text-brass transition-colors group-hover:bg-brass group-hover:text-obsidian">
            V
          </span>
          <span className="hidden leading-none sm:block">
            <span className="block font-serif text-lg tracking-[0.16em]">
              VELORA
            </span>
            <span className="mt-1 block text-[0.52rem] font-semibold uppercase tracking-[0.28em] text-taupe">
              Talent &amp; Events
            </span>
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="flex items-center gap-3 sm:gap-6">
          <NavLink
            to="/"
            end
            className={(props) => `${navLinkClasses(props)} hidden sm:inline-flex`}
          >
            Home
          </NavLink>
          <NavLink to="/about" className={navLinkClasses}>
            About
          </NavLink>
          <Link
            to="/login"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-porcelain/30 px-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-porcelain transition-colors hover:border-brass hover:bg-brass hover:text-obsidian focus:outline-none focus:ring-2 focus:ring-brass focus:ring-offset-2 focus:ring-offset-obsidian sm:px-5 sm:text-xs"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default LandingHeader;
