import React from "react";
import { Link } from "react-router-dom";

const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.417 2.175 8.796 2.163 12 2.163zm0 3.675A6.162 6.162 0 1 0 12 18.162 6.162 6.162 0 0 0 12 5.838zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z",
  },
  {
    name: "X",
    href: "https://twitter.com",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-porcelain/10 bg-obsidian text-porcelain">
      <div className="mx-auto max-w-7xl px-3 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.25fr_0.75fr_1fr]">
          <div className="max-w-md">
            <Link
              to="/"
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
            <p className="mt-5 max-w-sm font-serif text-2xl leading-snug">
              Curated talent. Unforgettable presence.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-taupe">
              Professional talent for exclusive events, brand moments, and
              memorable guest experiences.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-brass">
              Explore
            </h2>
            <nav aria-label="Footer navigation" className="mt-5 flex flex-col items-start gap-3">
              {[
                ["Home", "/"],
                ["About Velora", "/about"],
                ["Browse talent", "/main"],
                ["Client sign in", "/login"],
              ].map(([label, path]) => (
                <Link
                  key={path}
                  to={path}
                  className="rounded-sm text-sm text-porcelain/70 transition-colors hover:text-porcelain focus:outline-none focus:ring-2 focus:ring-brass"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-brass">
              Enquiries
            </h2>
            <p className="mt-5 text-sm leading-6 text-taupe">
              Planning an event or looking for the right brand presence?
            </p>
            <a
              href="mailto:info@velora.com.ph"
              className="mt-4 inline-flex border-b border-porcelain/30 pb-1 text-sm font-semibold text-porcelain transition-colors hover:border-brass hover:text-brass focus:outline-none focus:ring-2 focus:ring-brass"
            >
              Email our booking team
            </a>

            <div className="mt-7 flex gap-3" aria-label="Social media">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Velora on ${social.name}`}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-porcelain/20 text-taupe transition-colors hover:border-brass hover:bg-brass hover:text-obsidian focus:outline-none focus:ring-2 focus:ring-brass focus:ring-offset-2 focus:ring-offset-obsidian"
                >
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-porcelain/10 pt-6 text-xs text-taupe sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} VELORA. All rights reserved.</p>
          <p>Talent selected with intention.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
