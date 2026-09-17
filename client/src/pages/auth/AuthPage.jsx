import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="flex min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black font-sans relative overflow-hidden">
      {/* Ambient Decorative Lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-[#D8AF7F]/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tl from-[#D8AF7F]/10 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div 
        className={`flex w-full min-h-screen transition-all duration-700 ease-in-out relative z-10 ${isLogin ? 'flex-col md:flex-row' : 'flex-col md:flex-row-reverse'}`}
      >
        {/* Branding Panel */}
        <motion.div 
          layout
          className="relative w-full md:w-[55%] h-[20vh] md:h-screen bg-[#111] flex flex-col justify-between p-8 md:p-16 z-10 overflow-hidden md:sticky md:top-0"
          transition={{ type: "spring", stiffness: 90, damping: 20, mass: 1 }}
        >
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a1510] to-[#2a2015] opacity-80" />
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D8AF7F] rounded-full blur-[150px] opacity-10 translate-x-1/2 -translate-y-1/2 mix-blend-screen" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-black rounded-full blur-[100px] opacity-60 -translate-x-1/3 translate-y-1/3" />

          <div className="relative z-10 cursor-pointer" onClick={() => navigate('/')}>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#D8AF7F] font-serif">
              Aura Select
            </h1>
          </div>
          
          <div className="relative z-10 mt-auto hidden md:block">
            <h2 className="text-3xl md:text-5xl font-light text-white leading-tight mb-4">
              Elevate your <span className="font-bold text-[#D8AF7F]">standard.</span><br />
              Embrace the <span className="font-bold text-[#D8AF7F]">exclusive.</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-md">
              Experience the pinnacle of luxury and exclusivity. Join Aura Select today and elevate your lifestyle.
            </p>
          </div>
        </motion.div>

        {/* Form Panel */}
        <motion.div 
          layout
          className="w-full md:w-[45%] flex-1 bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6 md:p-12 z-20"
          transition={{ type: "spring", stiffness: 90, damping: 20, mass: 1 }}
        >
          <div className="w-full max-w-md py-8">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoginForm />
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <RegisterForm />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
