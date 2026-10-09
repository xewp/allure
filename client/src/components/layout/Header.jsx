import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API_URL from "../../config/api";
import MobileNav from "./MobileNav";

const Header = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!showModal) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") setShowModal(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showModal]);

  const handleBookingClick = async () => {
    if (location.pathname === "/booking") return;

    try {
      setLoading(true);
      const userStr =
        sessionStorage.getItem("user") || localStorage.getItem("user");

      if (!userStr) {
        navigate("/booking");
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user.id || user._id;
      const response = await fetch(`${API_URL}/api/users/${userId}/favorites`);

      if (response.ok) {
        const favorites = await response.json();
        const validFavorites = favorites.filter(
          (favorite) => favorite._id && favorite._id !== "undefined",
        );

        if (validFavorites.length === 0) {
          setShowModal(true);
        } else {
          navigate("/booking");
        }
      } else {
        navigate("/booking");
      }
    } catch {
      navigate("/booking");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscoverClick = () => {
    const directoryTab = activeTab === "FOREIGN" ? "FOREIGN" : "LOCAL";

    if (location.pathname === "/main" && onTabChange) {
      onTabChange(directoryTab);
      return;
    }

    navigate("/main", { state: { activeTab: directoryTab } });
  };

  const discoverIsActive =
    location.pathname === "/main" || location.pathname.startsWith("/model/");
  const favoritesIsActive = location.pathname === "/favorites";
  const bookingIsActive = location.pathname === "/booking";
  const profileIsActive =
    location.pathname === "/profile" || location.pathname === "/edit";

  const navItemClass = (isActive) =>
    `rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian lg:px-4 ${
      isActive
        ? "bg-porcelain text-obsidian"
        : "text-taupe hover:bg-porcelain/5 hover:text-porcelain"
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-porcelain/10 bg-obsidian/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          <Link
            to="/main"
            aria-label="VELORA talent directory"
            className="group inline-flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
          >
            <span className="flex h-9 w-9 items-center justify-center border border-brass/60 font-serif text-lg font-semibold text-brass transition-colors group-hover:bg-brass group-hover:text-obsidian">
              V
            </span>
            <span className="flex flex-col text-left leading-none">
              <span className="font-serif text-xl font-semibold tracking-[0.16em] text-porcelain sm:text-2xl">
                VELORA
              </span>
              <span className="mt-1 hidden text-[8px] font-semibold tracking-[0.28em] text-taupe min-[360px]:block">
                TALENT &amp; EVENTS
              </span>
            </span>
          </Link>

          <nav
            aria-label="Primary account navigation"
            className="hidden items-center gap-1 md:flex"
          >
            <button
              type="button"
              onClick={handleDiscoverClick}
              className={navItemClass(discoverIsActive)}
            >
              Discover
            </button>
            <Link
              to="/favorites"
              className={navItemClass(favoritesIsActive)}
            >
              Favorites
            </Link>
            <button
              type="button"
              onClick={handleBookingClick}
              disabled={loading}
              className={`${navItemClass(bookingIsActive)} disabled:cursor-wait disabled:opacity-50`}
            >
              {loading ? "Checking…" : "Bookings"}
            </button>
            <Link to="/profile" className={navItemClass(profileIsActive)}>
              Profile
            </Link>
          </nav>

          <span className="text-right text-[9px] font-semibold uppercase tracking-[0.2em] text-taupe md:hidden">
            Curated
            <br />
            talent
          </span>
        </div>
      </header>

      <MobileNav
        onBookingClick={handleBookingClick}
        bookingLoading={loading}
      />

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/85 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowModal(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="favorites-required-title"
            className="w-full max-w-md rounded-2xl border border-porcelain/10 bg-ink p-6 text-left shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-brass/40 bg-brass/10 text-brass">
              <svg
                aria-hidden="true"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.7}
                  d="M12 8.25v4.5m0 3h.008v.008H12v-.008ZM10.29 3.86 2.82 17.06a1.5 1.5 0 0 0 1.3 2.24h15.76a1.5 1.5 0 0 0 1.3-2.24L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z"
                />
              </svg>
            </div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brass">
              One quick step
            </p>
            <h2
              id="favorites-required-title"
              className="font-serif text-3xl font-semibold text-porcelain"
            >
              Select talent before booking
            </h2>
            <p className="mt-3 leading-relaxed text-taupe">
              Save at least one model to your favorites, then return to create
              your booking request.
            </p>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="min-h-11 rounded-lg border border-porcelain/15 px-5 py-2.5 font-semibold text-porcelain transition-colors hover:bg-porcelain/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
              >
                Not now
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  navigate("/main");
                }}
                className="min-h-11 rounded-lg bg-oxblood px-5 py-2.5 font-semibold text-porcelain transition-colors hover:bg-oxblood/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
              >
                Browse talent
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default Header;
