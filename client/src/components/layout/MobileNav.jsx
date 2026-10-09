import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const navigationItems = [
  {
    label: "Discover",
    path: "/main",
    matches: (pathname) => pathname === "/main" || pathname.startsWith("/model/"),
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.7}
        d="m3.75 12 8.25-8.25L20.25 12M5.25 10.5v9.75h13.5V10.5M9 20.25v-6h6v6"
      />
    ),
  },
  {
    label: "Favorites",
    path: "/favorites",
    matches: (pathname) => pathname === "/favorites",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.7}
        d="M21 8.25c0 5.25-9 11.25-9 11.25S3 13.5 3 8.25A4.5 4.5 0 0 1 12 8a4.5 4.5 0 0 1 9 .25Z"
      />
    ),
  },
  {
    label: "Bookings",
    path: "/booking",
    matches: (pathname) => pathname === "/booking",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.7}
        d="M6.75 3.75v2.5m10.5-2.5v2.5M4.5 9h15m-13.25-4h11.5A1.75 1.75 0 0 1 19.5 6.75v12a1.75 1.75 0 0 1-1.75 1.75H6.25a1.75 1.75 0 0 1-1.75-1.75v-12A1.75 1.75 0 0 1 6.25 5Z"
      />
    ),
  },
  {
    label: "Profile",
    path: "/profile",
    matches: (pathname) => pathname === "/profile" || pathname === "/edit",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.7}
        d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
      />
    ),
  },
];

const MobileNav = ({ onBookingClick, bookingLoading = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    if (item.path === "/booking" && onBookingClick) {
      onBookingClick();
      return;
    }

    if (location.pathname !== item.path) {
      navigate(item.path);
    }
  };

  return (
    <nav
      aria-label="Account navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-porcelain/10 bg-obsidian/95 px-2 pt-1.5 shadow-[0_-12px_32px_rgba(0,0,0,0.28)] backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto grid max-w-lg grid-cols-4">
        {navigationItems.map((item) => {
          const isActive = item.matches(location.pathname);
          const isLoading = item.path === "/booking" && bookingLoading;

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => handleItemClick(item)}
              disabled={isLoading}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
              className={`flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1 text-[10px] font-semibold tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian disabled:opacity-50 ${
                isActive ? "text-brass" : "text-taupe hover:text-porcelain"
              }`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-5 w-5"
              >
                {item.icon}
              </svg>
              <span>{isLoading ? "Loading" : item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
