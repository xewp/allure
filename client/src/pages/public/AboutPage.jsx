import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LandingHeader from "../../components/layout/LandingHeader";
import Footer from "../../components/layout/Footer";
import heroVideo from "../../assets/About.mp4";
import ourModel from "../../assets/ourmodel.jpg";
import ourModel1 from "../../assets/ourmodel1.jpg";
import why from "../../assets/why.jpg";
import why1 from "../../assets/why1.jpg";
import why2 from "../../assets/why2.jpg";

const features = [
  {
    number: "01",
    title: "Trained & professional",
    text: "Our talent understands the demands of the industry. Every person is prepared, disciplined, and ready to meet a high standard.",
    image: why,
  },
  {
    number: "02",
    title: "VIP-ready & experienced",
    text: "From exclusive gatherings to prestigious functions, our team brings confidence, social awareness, and grace to the room.",
    image: why1,
  },
  {
    number: "03",
    title: "Discreet & reliable",
    text: "We value confidentiality, punctuality, and clear communication so your event and brand are represented with care.",
    image: why2,
  },
];

const services = [
  {
    title: "Event PR & Promotions",
    text: "Polished representatives who communicate your brand with warmth, confidence, and impact.",
  },
  {
    title: "Brand Ambassadors & Models",
    text: "A curated roster for campaigns, trade shows, launches, and high-profile events.",
  },
  {
    title: "Corporate Hosting & VIP Engagement",
    text: "Professional hosts who help corporate events, galas, and private experiences run beautifully.",
  },
  {
    title: "Custom Requests",
    text: "Tailored talent recommendations for a specific look, brief, audience, or occasion.",
  },
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

const AboutPage = () => {
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(
              (current) => new Set([...current, entry.target.dataset.section]),
            );
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" },
    );

    const sections = document.querySelectorAll("[data-section]");
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const revealClass = (section) =>
    `transition-all duration-700 motion-reduce:transform-none motion-reduce:transition-none ${
      visibleSections.has(section)
        ? "translate-y-0 opacity-100"
        : "translate-y-6 opacity-0"
    }`;

  const handleBooking = () => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    navigate(token ? "/booking" : "/login");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-obsidian font-sans text-porcelain">
      <LandingHeader />

      <main>
        <section className="relative flex min-h-[78svh] items-end overflow-hidden pb-14 pt-32 sm:pb-20">
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
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-obsidian/35" />
          </div>

          <div className="relative mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brass">
              The Velora story
            </p>
            <h1 className="mt-5 max-w-4xl font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
              More than a look. The right energy for the moment.
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-6 text-porcelain/75 sm:text-base sm:leading-7">
              Curated talent. Unforgettable presence.
            </p>
          </div>
        </section>

        <section
          data-section="story"
          className={`bg-porcelain py-20 text-obsidian sm:py-28 ${revealClass("story")}`}
        >
          <div className="mx-auto grid max-w-7xl gap-12 px-3 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-oxblood">
                Who we are
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                Representation with intention.
              </h2>
            </div>
            <div className="lg:pt-2">
              <p className="font-serif text-2xl leading-snug text-obsidian sm:text-3xl">
                VELORA was founded to elevate events, brands, and experiences
                through exceptional people.
              </p>
              <p className="mt-6 max-w-2xl text-base leading-7 text-obsidian/65">
                What began as a vision for premium event talent has become a
                trusted partnership for clients seeking poise, personality,
                and professionalism. We consider the full brief—not only how
                someone looks, but how they connect, communicate, and carry a
                room.
              </p>
              <div className="mt-9 grid grid-cols-3 border-y border-obsidian/15 py-6">
                {[
                  ["50+", "Talent"],
                  ["02", "Regions"],
                  ["04", "Services"],
                ].map(([value, label]) => (
                  <div key={label} className="border-r border-obsidian/15 px-3 first:pl-0 last:border-r-0">
                    <p className="font-serif text-2xl sm:text-3xl">{value}</p>
                    <p className="mt-1 text-[0.65rem] uppercase tracking-[0.16em] text-oxblood sm:text-xs">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          data-section="talent"
          className={`bg-ink py-20 sm:py-28 ${revealClass("talent")}`}
        >
          <div className="mx-auto grid max-w-7xl gap-12 px-3 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
            <div className="relative mx-auto w-full max-w-xl pb-10 pr-8 sm:pb-16 sm:pr-14">
              <div className="aspect-[3/4] w-[72%] overflow-hidden rounded-xl bg-obsidian">
                <img
                  src={ourModel}
                  alt="Velora professional talent portrait"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 aspect-[3/4] w-[48%] overflow-hidden rounded-xl border-4 border-ink bg-obsidian">
                <img
                  src={ourModel1}
                  alt="Curated Velora model portrait"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute bottom-6 left-[54%] flex h-24 w-24 flex-col items-center justify-center rounded-full bg-oxblood text-center text-white sm:bottom-10 sm:h-28 sm:w-28">
                <span className="font-serif text-2xl">50+</span>
                <span className="mt-1 text-[0.6rem] uppercase tracking-[0.16em]">
                  Professionals
                </span>
              </div>
            </div>

            <div className="max-w-xl lg:pl-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brass">
                Our talent
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                Curated for character as much as style.
              </h2>
              <p className="mt-6 text-base leading-7 text-taupe">
                Every event is an opportunity to leave a lasting impression.
                Our roster brings sophistication, poise, and professionalism
                to exclusive events, brand promotions, and VIP experiences.
              </p>
              <p className="mt-4 text-base leading-7 text-taupe">
                We select with the full experience in mind, helping clients
                find people who feel authentic to the occasion and confident
                in the role.
              </p>
              <button
                type="button"
                onClick={() => navigate("/main")}
                className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-xl bg-porcelain px-6 py-3 text-sm font-semibold text-obsidian transition-colors hover:bg-brass focus:outline-none focus:ring-2 focus:ring-brass focus:ring-offset-2 focus:ring-offset-ink"
              >
                Meet the roster
                <ArrowIcon />
              </button>
            </div>
          </div>
        </section>

        <section
          data-section="standards"
          className={`bg-porcelain py-20 text-obsidian sm:py-28 ${revealClass("standards")}`}
        >
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-oxblood">
                The Velora standard
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                What clients can expect.
              </h2>
            </div>

            <div className="mt-12 border-t border-obsidian/15">
              {features.map((feature, index) => (
                <article
                  key={feature.number}
                  className="grid gap-7 border-b border-obsidian/15 py-8 md:grid-cols-[4rem_1fr_1.15fr] md:items-center"
                >
                  <span className="text-xs font-semibold tracking-widest text-oxblood">
                    {feature.number}
                  </span>
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl">
                      {feature.title}
                    </h3>
                    <p className="mt-3 max-w-lg text-sm leading-6 text-obsidian/65">
                      {feature.text}
                    </p>
                  </div>
                  <div
                    className={`aspect-[16/10] overflow-hidden rounded-xl md:aspect-[2/1] ${
                      index % 2 === 1 ? "md:order-last" : ""
                    }`}
                  >
                    <img
                      src={feature.image}
                      alt={`${feature.title} at Velora`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          data-section="services"
          className={`bg-obsidian py-20 sm:py-28 ${revealClass("services")}`}
        >
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brass">
                  Our services
                </p>
                <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                  Designed around the brief.
                </h2>
                <p className="mt-5 max-w-md text-sm leading-6 text-taupe">
                  From one standout host to a complete event team, we help
                  shape the right mix of talent for the experience.
                </p>
              </div>

              <div className="grid gap-px overflow-hidden rounded-2xl border border-porcelain/15 bg-porcelain/15 sm:grid-cols-2">
                {services.map((service, index) => (
                  <article key={service.title} className="bg-ink p-6 sm:p-8">
                    <span className="text-xs font-semibold tracking-widest text-brass">
                      0{index + 1}
                    </span>
                    <h3 className="mt-8 font-serif text-2xl text-porcelain">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-taupe">
                      {service.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-oxblood py-16 sm:py-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-3 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-porcelain/80">
                Ready when you are
              </p>
              <h2 className="mt-3 font-serif text-3xl leading-tight text-white sm:text-4xl">
                Tell us what the moment needs.
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/75">
                Explore the roster, choose your favourites, and begin your
                booking when you find the right fit.
              </p>
            </div>
            <button
              type="button"
              onClick={handleBooking}
              className="inline-flex min-h-12 w-fit shrink-0 items-center justify-center gap-3 rounded-xl bg-porcelain px-6 py-3 text-sm font-semibold text-obsidian transition-colors hover:bg-brass focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-oxblood"
            >
              Book talent
              <ArrowIcon />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
