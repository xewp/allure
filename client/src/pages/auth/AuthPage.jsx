import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === '/login';

  // Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <main className="min-h-screen bg-obsidian font-sans text-porcelain">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.08fr)_minmax(440px,0.92fr)]">
        <Motion.section
          layout
          className="relative hidden min-h-screen overflow-hidden border-r border-porcelain/10 bg-ink p-10 lg:flex lg:flex-col lg:justify-between xl:p-16"
          transition={{ duration: 0.35, ease: "easeOut" }}
          aria-label="VELORA brand introduction"
        >
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute inset-y-0 right-0 w-px bg-brass/30" />
            <div className="absolute -right-28 top-24 h-80 w-80 rounded-full border border-brass/20" />
            <div className="absolute -right-12 top-40 h-52 w-52 rounded-full border border-brass/10" />
            <div className="absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-obsidian/60 to-transparent" />
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="relative z-10 w-fit text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
            aria-label="VELORA home"
          >
            <span className="block font-serif text-4xl tracking-[0.14em] text-porcelain">VELORA</span>
            <span className="mt-2 block text-[10px] font-semibold tracking-[0.38em] text-brass">
              TALENT &amp; EVENTS
            </span>
          </button>

          <div className="relative z-10 max-w-xl">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.32em] text-brass">
              Private client access
            </p>
            <h1 className="font-serif text-5xl leading-[1.06] text-porcelain xl:text-7xl">
              Curated talent.<br />Unforgettable presence.
            </h1>
            <p className="mt-7 max-w-md text-base leading-7 text-taupe">
              Discover distinctive talent and manage every booking through one considered experience.
            </p>
          </div>

          <p className="relative z-10 text-xs tracking-[0.18em] text-taupe/70">
            SELECTED WITH INTENTION
          </p>
        </Motion.section>

        <section className="flex min-h-screen flex-col bg-porcelain text-obsidian">
          <header className="flex items-center justify-between border-b border-obsidian/10 px-5 py-5 sm:px-8 lg:hidden">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood"
              aria-label="VELORA home"
            >
              <span className="block font-serif text-2xl tracking-[0.12em]">VELORA</span>
              <span className="block text-[8px] font-semibold tracking-[0.3em] text-oxblood">TALENT &amp; EVENTS</span>
            </button>
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-taupe">
              {isLogin ? "Client sign in" : "Request access"}
            </span>
          </header>

          <Motion.div
            layout
            className="flex flex-1 items-start justify-center px-5 py-10 sm:px-10 lg:items-center lg:px-12 lg:py-16 xl:px-20"
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <Motion.div
                  key="login"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <LoginForm />
                </Motion.div>
              ) : (
                <Motion.div
                  key="register"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <RegisterForm />
                </Motion.div>
              )}
            </AnimatePresence>
            </div>
          </Motion.div>
        </section>
      </div>
    </main>
  );
};

export default AuthPage;
