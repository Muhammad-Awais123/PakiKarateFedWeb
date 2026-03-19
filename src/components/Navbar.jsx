import React, { useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import ThemeToggleBtn from "./ThemeToggleBtn";
import { motion } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = ({ theme, setTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/", type: "home" },
    { name: "About", path: "/", hash: "#about-us" },
    { name: "Events", path: "/events" },
    { name: "Rankings", path: "/rankings" },
    { name: "Contact", path: "/", hash: "#contact-us" },
  ];

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= OUTSIDE CLICK ================= */
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
      return;
    }

    if (link.hash) {
      if (location.pathname === "/") {
        const el = document.getElementById(link.hash.replace("#", ""));
        el?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate(`/${link.hash}`);
      }
      return;
    }

    navigate(link.path);
  };

  const isActive = (link) =>
    link.path && location.pathname === link.path;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`sticky top-0 z-50 flex justify-between items-center px-5 lg:px-16 py-3
      backdrop-blur-2xl border-b transition-all duration-500
      
      ${
        scrolled
          ? "bg-white/70 dark:bg-black/60 shadow-lg border-white/20"
          : "bg-white/30 dark:bg-black/30 border-transparent"
      }`}
    >
      {/* LOGO */}
      <Link to="/">
        <motion.img
          src={theme === "dark" ? assets.darlogo : assets.Logo}
          className="w-14 cursor-pointer"
          whileHover={{ scale: 1.06 }}
          alt="logo"
        />
      </Link>

      {/* NAV LINKS */}
      <div
        ref={sidebarRef}
        className={`flex gap-6 font-medium text-sm
      
        ${
          !sidebarOpen
            ? "max-sm:w-0 overflow-hidden"
            : "max-sm:w-64 max-sm:pl-8"
        }

        max-sm:fixed max-sm:right-0 max-sm:top-0 max-sm:h-full
        max-sm:flex-col max-sm:pt-24
        max-sm:bg-black/80 max-sm:backdrop-blur-xl
        transition-all duration-500`}
      >
        <img
          src={assets.close_icon}
          className="w-6 absolute right-5 top-5 sm:hidden cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        />

        {navLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => handleNavClick(link)}
            className={`relative transition duration-300
            ${
              isActive(link)
                ? "text-green-500"
                : "text-gray-800 dark:text-gray-200 hover:text-green-500"
            }`}
          >
            {link.name}

            {/* underline animation */}
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-500 transition-all duration-500 group-hover:w-full"></span>
          </button>
        ))}
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        <ThemeToggleBtn theme={theme} setTheme={setTheme} />

        {/* MOBILE MENU */}
        <img
          src={theme === "dark" ? assets.menu_icon_dark : assets.menu_icon}
          onClick={() => setSidebarOpen(true)}
          className="w-7 sm:hidden cursor-pointer"
        />

        {/* CONNECT BUTTON — FIXED */}
        <a
          href="/#contact-us"
          className="
          hidden sm:flex items-center gap-2
          px-5 py-2 rounded-full text-sm font-semibold
          bg-gradient-to-r from-green-600 to-green-500
          text-white
          shadow-lg shadow-green-500/20
          hover:scale-105 hover:shadow-green-500/40
          transition-all duration-300
          backdrop-blur-xl
          "
        >
          Connect
          <img src={assets.arrow_icon} width={12} alt="arrow" />
        </a>
      </div>
    </motion.nav>
  );
};

export default Navbar;