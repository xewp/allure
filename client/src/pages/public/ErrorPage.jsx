import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-obsidian px-3 py-16 font-sans text-porcelain sm:px-6">
      <div
        className="absolute inset-y-0 right-0 hidden w-1/3 border-l border-porcelain/10 bg-ink lg:block"
        aria-hidden="true"
      />
      <div
        className="absolute right-[16%] top-1/2 hidden -translate-y-1/2 font-serif text-[20rem] leading-none text-porcelain/[0.025] lg:block"
        aria-hidden="true"
      >
        V
      </div>

      <section
        className={`relative mx-auto w-full max-w-7xl transition-all duration-700 motion-reduce:transform-none motion-reduce:transition-none ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
        }`}
      >
        <Link
          to="/"
          aria-label="Velora home"
          className="inline-flex items-center gap-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brass focus:ring-offset-2 focus:ring-offset-obsidian"
        >
          <span className="flex h-11 w-11 items-center justify-center border border-brass/70 font-serif text-2xl text-brass">
            V
          </span>
          <span>
            <span className="block font-serif text-xl tracking-[0.16em]">
              VELORA
            </span>
            <span className="mt-1 block text-[0.55rem] font-semibold uppercase tracking-[0.28em] text-taupe">
              Talent &amp; Events
            </span>
          </span>
        </Link>

        <div className="mt-16 max-w-2xl sm:mt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brass">
            Error 404
          </p>
          <h1 className="mt-5 font-serif text-5xl leading-[0.98] sm:text-6xl md:text-7xl">
            This page has left the room.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-taupe">
            The address may have changed, or the page may no longer be
            available. We can take you back to somewhere familiar.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleGoBack}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-oxblood px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-oxblood/85 focus:outline-none focus:ring-2 focus:ring-brass focus:ring-offset-2 focus:ring-offset-obsidian"
            >
              Go back
            </button>
            <Link
              to="/"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-porcelain/30 px-6 py-3 text-sm font-semibold text-porcelain transition-colors hover:border-brass hover:text-brass focus:outline-none focus:ring-2 focus:ring-brass focus:ring-offset-2 focus:ring-offset-obsidian"
            >
              Return home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ErrorPage;
