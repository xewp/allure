import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LandingHeader from "../../components/layout/LandingHeader";
import Footer from "../../components/layout/Footer";
import heroVideo from "../../assets/Landing.mp4";
import ourModel from "../../assets/ourmodel.jpg";
import ourModel1 from "../../assets/ourmodel1.jpg";
import why from "../../assets/why.jpg";
import why1 from "../../assets/why1.jpg";
import why2 from "../../assets/why2.jpg";

const services = [
  {
    number: "01",
    title: "Event PR & promotions",
    description:
      "Confident, polished representatives who make every guest interaction feel considered.",
  },
  {
    number: "02",
    title: "Brand ambassadors",
    description:
      "Curated talent selected to reflect your campaign, audience, and creative direction.",
  },
  {
    number: "03",
    title: "Corporate & VIP hosting",
    description:
      "Experienced hosts for launches, galas, private events, and high-profile engagements.",
  },
  {
    number: "04",
    title: "Bespoke requests",
    description:
      "A tailored approach for briefs that need a particular look, skill set, or presence.",
  },
];

const bookingSteps = [
  ["01", "Discover", "Explore our curated local and international talent."],
  ["02", "Select", "Save the people who fit your vision and event brief."],
  ["03", "Book", "Share the details and our team will handle the rest."],
];

const ArrowIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M5 12h14m-5-5 5 5-5 5"
    />
  </svg>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-obsidian font-sans text-porcelain">
      <LandingHeader />

      <main>
        <section className="relative flex min-h-[100svh] items-end overflow-hidden pb-16 pt-32 sm:pb-20 lg:pb-24">
          <div className="absolute inset-0" aria-hidden="true">
            <video
              src={heroVideo}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/25 to-obsidian/40" />
          </div>

          <div
            className={`relative mx-auto w-full max-w-7xl px-3 transition-all duration-700 motion-reduce:transform-none motion-reduce:transition-none sm:px-6 lg:px-8 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }`}
          >
            <div className="max-w-3xl">
              <p className="mb-5 flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-brass sm:text-xs">
                <span className="h-px w-8 bg-brass" />
                Talent &amp; Events
              </p>
              <h1 className="font-serif text-5xl font-medium leading-[0.92] tracking-[-0.04em] text-porcelain sm:text-6xl md:text-7xl lg:text-8xl">
                VELORA
              </h1>
              <p className="mt-6 max-w-xl font-serif text-2xl leading-tight text-porcelain sm:text-3xl md:text-4xl">
                Curated talent. Unforgettable presence.
              </p>
              <p className="mt-5 max-w-lg text-sm leading-6 text-porcelain/70 sm:text-base sm:leading-7">
                Exceptional people for brand moments, private occasions, and
                events that deserve to be remembered.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/main")}
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-oxblood px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-oxblood/85 focus:outline-none focus:ring-2 focus:ring-brass focus:ring-offset-2 focus:ring-offset-obsidian"
                >
                  Explore talent
                  <ArrowIcon />
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/about")}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-porcelain/35 px-6 py-3 text-sm font-semibold text-porcelain transition-colors hover:border-porcelain hover:bg-porcelain/10 focus:outline-none focus:ring-2 focus:ring-brass focus:ring-offset-2 focus:ring-offset-obsidian"
                >
                  Our story
                </button>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-label="Velora at a glance"
          className="border-y border-porcelain/10 bg-ink"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-porcelain/10 px-3 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
            {[
              ["50+", "Curated professionals"],
              ["Local + global", "A versatile talent roster"],
              ["Made to fit", "Flexible event bookings"],
            ].map(([value, label]) => (
              <div key={label} className="px-2 py-6 sm:px-6 sm:py-8">
                <p className="font-serif text-2xl text-brass sm:text-3xl">
                  {value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-taupe">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-porcelain py-20 text-obsidian sm:py-28">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-oxblood">
                  The roster
                </p>
                <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                  Distinct talent for every kind of room.
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigate("/main")}
                className="inline-flex w-fit items-center gap-2 border-b border-obsidian pb-1 text-sm font-semibold transition-colors hover:border-oxblood hover:text-oxblood focus:outline-none focus:ring-2 focus:ring-oxblood focus:ring-offset-4 focus:ring-offset-porcelain"
              >
                View all talent
                <ArrowIcon />
              </button>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
              {[
                [ourModel, "Editorial talent portrait", "Editorial"],
                [why, "Professional event talent", "Events"],
                [ourModel1, "Velora model portrait", "Campaign"],
              ].map(([image, alt, label]) => (
                <article key={label}>
                  <div className="aspect-[3/4] overflow-hidden rounded-xl bg-ink/10">
                    <img
                      src={image}
                      alt={alt}
                      className="h-full w-full object-cover transition-transform duration-500 motion-reduce:transition-none md:hover:scale-[1.02]"
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 border-b border-obsidian/15 pb-3">
                    <p className="font-serif text-lg">{label}</p>
                    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-oxblood">
                      Velora
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-ink py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-14 px-3 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brass">
                What we do
              </p>
              <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight sm:text-5xl">
                Presence, matched to the moment.
              </h2>
              <div className="mt-10 border-t border-porcelain/15">
                {services.map((service) => (
                  <article
                    key={service.number}
                    className="grid gap-3 border-b border-porcelain/15 py-6 sm:grid-cols-[3rem_1fr]"
                  >
                    <span className="text-xs font-semibold tracking-widest text-brass">
                      {service.number}
                    </span>
                    <div>
                      <h3 className="font-serif text-2xl text-porcelain">
                        {service.title}
                      </h3>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-taupe">
                        {service.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="self-start rounded-2xl border border-porcelain/15 bg-obsidian p-6 sm:p-8 lg:sticky lg:top-28">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brass">
                From brief to booking
              </p>
              <h2 className="mt-4 font-serif text-3xl">Simple by design.</h2>
              <ol className="mt-8 space-y-7">
                {bookingSteps.map(([number, title, description]) => (
                  <li key={number} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brass/40 text-xs font-semibold text-brass">
                      {number}
                    </span>
                    <div>
                      <h3 className="font-semibold text-porcelain">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-taupe">
                        {description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <button
                type="button"
                onClick={() => navigate("/main")}
                className="mt-9 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-porcelain px-5 py-3 text-sm font-semibold text-obsidian transition-colors hover:bg-brass focus:outline-none focus:ring-2 focus:ring-brass focus:ring-offset-2 focus:ring-offset-obsidian"
              >
                Start discovering
                <ArrowIcon />
              </button>
            </aside>
          </div>
        </section>

        <section className="bg-porcelain py-20 text-obsidian sm:py-28">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-oxblood">
                  Why Velora
                </p>
                <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                  Professional at every touchpoint.
                </h2>
                <p className="mt-5 max-w-lg text-base leading-7 text-obsidian/65">
                  We curate for more than appearance. Preparation, discretion,
                  and the ability to represent your vision are part of every
                  selection.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {[why1, why2, ourModel].map((image, index) => (
                  <div
                    key={image}
                    className={`aspect-[3/4] overflow-hidden rounded-xl ${
                      index === 1 ? "-translate-y-5" : ""
                    }`}
                  >
                    <img
                      src={image}
                      alt={
                        index === 0
                          ? "Experienced Velora event professional"
                          : index === 1
                            ? "Reliable Velora talent at an event"
                            : "Velora curated model"
                      }
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-14 grid border-t border-obsidian/15 md:grid-cols-3">
              {[
                ["01", "Carefully curated", "Talent chosen for presence, professionalism, and fit."],
                ["02", "Event ready", "Prepared for premium events, campaigns, and VIP audiences."],
                ["03", "Quietly reliable", "Clear communication, punctuality, and discretion throughout."],
              ].map(([number, title, description]) => (
                <article
                  key={number}
                  className="border-b border-obsidian/15 py-7 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0"
                >
                  <span className="text-xs font-semibold tracking-widest text-oxblood">
                    {number}
                  </span>
                  <h3 className="mt-4 font-serif text-2xl">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-obsidian/65">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-oxblood py-16 sm:py-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-3 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-porcelain/80">
                Make an impression
              </p>
              <h2 className="mt-3 font-serif text-3xl leading-tight text-white sm:text-4xl">
                Find the presence your next event calls for.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate("/main")}
              className="inline-flex min-h-12 w-fit shrink-0 items-center justify-center gap-3 rounded-xl bg-porcelain px-6 py-3 text-sm font-semibold text-obsidian transition-colors hover:bg-brass focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-oxblood"
            >
              Explore talent
              <ArrowIcon />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
