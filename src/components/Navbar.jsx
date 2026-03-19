import React, { useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import ThemeToggleBtn from "./ThemeToggleBtn";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = ({ theme, setTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const sidebarRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Updated Links: Removed emojis, kept structure for SVGs
  const navLinks = [
    { name: "Home", path: "/", type: "home" },
    { name: "About", path: "/", hash: "#about-us" },
    { name: "Events", path: "/events" },
    { name: "Rankings", path: "/rankings" },
    { name: "Contact", path: "/", hash: "#contact-us" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!sidebarOpen) return;
    const close = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [sidebarOpen]);

  const handleNavClick = (link) => {
    setSidebarOpen(false);
    if (link.type === "home") {
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (link.hash) {
      if (location.pathname === "/") {
        const el = document.getElementById(link.hash.replace("#", ""));
        el?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate(`/${link.hash}`);
      }
    } else {
      navigate(link.path);
    }
  };

  const isActive = (link) => link.path && location.pathname === link.path;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 transition-all duration-500">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`flex items-center justify-between w-full max-w-7xl px-6 py-3 rounded-2xl transition-all duration-500
        ${scrolled 
          ? "bg-white/70 dark:bg-black/40 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] border border-white/20 dark:border-white/10" 
          : "bg-transparent border-transparent"}`}
      >
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <motion.img
            src={theme === "dark" ? assets.darlogo : assets.Logo}
            className="w-10 md:w-12 h-auto object-contain"
            alt="logo"
            whileHover={{ scale: 1.05 }}
          />
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex items-center gap-1 bg-gray-200/20 dark:bg-white/5 p-1 rounded-xl border border-white/10">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link)}
              onMouseEnter={() => setHoveredLink(link.name)}
              onMouseLeave={() => setHoveredLink(null)}
              className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg
              ${isActive(link) ? "text-green-500" : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"}`}
            >
              {link.name}
              {hoveredLink === link.name && (
                <motion.div
                  layoutId="nav-hover"
                  className="absolute inset-0 bg-white dark:bg-white/10 rounded-lg shadow-sm -z-10"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
              {isActive(link) && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          <ThemeToggleBtn theme={theme} setTheme={setTheme} />
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/#contact-us')}
            className="hidden sm:block px-5 py-2 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-500 transition-colors shadow-lg shadow-green-500/20"
          >
            Connect
          </motion.button>

          {/* MOBILE TOGGLE */}
          <button 
            className="md:hidden p-2 text-gray-600 dark:text-gray-300"
            onClick={() => setSidebarOpen(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>
          </button>
        </div>

        {/* MOBILE SIDEBAR */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                ref={sidebarRef}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-full w-[280px] bg-white dark:bg-[#0a0a0a] z-[70] p-8 shadow-2xl md:hidden"
              >
                <div className="flex flex-col gap-8">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xl tracking-tighter text-green-500">MENU</span>
                    <button onClick={() => setSidebarOpen(false)} className="p-2">
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg>
                    </button>
                  </div>
                  
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link, i) => (
                      <motion.button
                        key={link.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => handleNavClick(link)}
                        className="text-left text-2xl font-semibold hover:text-green-500 transition-colors py-2 border-b border-gray-100 dark:border-white/5"
                      >
                        {link.name}
                      </motion.button>
                    ))}
                  </nav>

                  <button className="mt-4 w-full py-4 bg-green-600 text-white rounded-2xl font-bold shadow-xl shadow-green-500/20">
                    Get Started
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};

export default Navbar;