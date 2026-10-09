import React, { useEffect, useState } from "react";

/**
 * Displays when the API reports that the system is in maintenance mode.
 */
const MaintenancePage = () => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          window.location.reload();
          return 10;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-obsidian px-3 py-12 font-sans text-porcelain sm:px-6">
      <div
        className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-brass/60 to-transparent"
        aria-hidden="true"
      />
      <section className="relative w-full max-w-xl rounded-2xl border border-porcelain/15 bg-ink p-6 text-center shadow-2xl sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center border border-brass/60 font-serif text-2xl text-brass">
          V
        </div>
        <p className="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-brass">
          Velora · Talent &amp; Events
        </p>

        <div className="mx-auto mt-10 flex h-16 w-16 items-center justify-center rounded-full bg-porcelain/5 text-brass">
          <svg
            aria-hidden="true"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11.42 15.17 17.25 21A2.652 2.652 0 1 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745-2.562L5.909 7.5H4.5L2.25 3.75 3.75 2.25 7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
            />
          </svg>
        </div>

        <h1 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
          We’ll be right back.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-porcelain/75">
          We’re making a few considered improvements to the Velora experience.
          Our team is working to have everything ready again shortly.
        </p>

        <div className="mt-8 rounded-xl border border-porcelain/10 bg-obsidian px-5 py-4">
          <p className="text-sm text-taupe">
            Automatically trying again in{" "}
            <span
              className="font-semibold tabular-nums text-brass"
              aria-live="polite"
            >
              {countdown} seconds
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-oxblood px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-oxblood/85 focus:outline-none focus:ring-2 focus:ring-brass focus:ring-offset-2 focus:ring-offset-ink sm:w-auto"
        >
          Try again now
        </button>

        <p className="mt-7 text-xs leading-5 text-taupe">
          Thank you for your patience while we refine the experience.
        </p>
      </section>
    </main>
  );
};

export default MaintenancePage;
