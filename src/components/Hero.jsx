import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import HeroImage from '../assets/Home_Image.jpg';
import assets from '../assets/assets';

const Hero = () => {
  const controls = useAnimation();
  const scrollRef = useRef(null);

  useEffect(() => {
    const animateParticles = () => {
      const particles = document.querySelectorAll('.particle');
      particles.forEach((p) => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        p.style.transform = `translate(${x}px, ${y}px)`;
      });
    };
    const interval = setInterval(animateParticles, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center items-center text-center overflow-hidden bg-black">
      
      {/* Background Hero Image */}
      <motion.img
        src={HeroImage}
        alt="Hero Background"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 12, ease: "easeOut" }}
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      {/* Particle/Light Streaks */}
      {[...Array(20)].map((_, i) => (
        <div key={i} className="particle absolute w-1 h-1 rounded-full bg-[#008000] opacity-40 blur-md" />
      ))}

      {/* Dark Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 via-black/10 to-black/70 z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-6xl px-6 sm:px-12 flex flex-col items-center">

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-6"
        >
          <span className="inline-block px-5 py-3 bg-white/10 backdrop-blur-md rounded-full text-white font-semibold tracking-wider border border-white/20 animate-pulse">
            ⚡ ESTABLISHED 1965
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight"
        >
          <span>The Pakistan</span> <br />
          <span className="text-[#008000] drop-shadow-lg">Karate Federation</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-white/90 mt-4 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed font-light"
        >
          Experience the power, discipline, and thrill of 
          <span className="text-[#008000] font-semibold"> Pakistan's premier</span> 
          martial arts championships.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.9 }}
          className="flex flex-wrap justify-center gap-8 mt-10"
        >
          {[
            { number: '5000+', label: 'Active Members' },
            { number: '50+', label: 'Training Centers' },
            { number: '100+', label: 'Annual Events' }
          ].map((stat, idx) => (
            <motion.div 
              key={idx} 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 * idx }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#008000] drop-shadow-lg animate-pulse">{stat.number}</div>
              <div className="text-white/60 text-sm sm:text-base tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mt-12"
        >
          <a
            href="#events"
            className="w-full sm:w-auto px-8 py-3 bg-[#008000] text-white rounded-full font-semibold text-lg transition hover:scale-105 hover:shadow-xl shadow-[#008000]/50"
          >
            View Championships
          </a>
          <a
            href="#registration"
            className="w-full sm:w-auto px-8 py-3 bg-transparent border-2 border-white/30 text-white rounded-full font-semibold text-lg transition hover:border-[#008000] hover:text-[#008000] backdrop-blur-sm"
          >
            Join the Dojo
          </a>
        </motion.div>

        {/* Karate Image Hero */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1.6 }}
          className="mt-16 w-full max-w-5xl relative"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
            <img
              src={assets.Karate_Image} // <- your AI generated karate image
              alt="Karate Practitioners"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#008000]/20 to-transparent mix-blend-overlay" />
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1"
        >
          <span className="text-white/50 text-sm tracking-wider uppercase">Scroll Down</span>
          <div className="w-5 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-[#008000] rounded-full mt-2"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;