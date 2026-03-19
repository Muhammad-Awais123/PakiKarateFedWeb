import React from 'react';
import { motion } from 'framer-motion';
import HeroImage from '../assets/Home_Image.jpg';
import assets from '../assets/assets';

const Hero = ({ theme }) => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#080808] transition-colors duration-500 overflow-hidden">
      
      {/* BACKGROUND WATERMARK - Subtle & Professional */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] dark:opacity-[0.04] pointer-events-none select-none">
        <h2 className="text-[22vw] font-black tracking-tighter uppercase">Pakistan</h2>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center py-20 lg:py-0">
        
        {/* LEFT CONTENT: Balanced & Readable */}
        <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <div className="h-[2px] w-8 bg-green-700 dark:bg-green-500" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">
                Official Karate Federation
              </span>
            </div>

            {/* Adjusted Font Sizes for Responsiveness */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-black dark:text-white leading-[1.1] tracking-tight uppercase">
              The Path of <br />
              <span className="text-green-700 dark:text-green-500">Excellence</span>
            </h1>

            <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-base md:text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
              Experience the fusion of traditional values and modern athletic power. 
              Join the legacy that has been forging champions since 1965.
            </p>

            {/* Professional Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-10">
              <button className="w-full sm:w-auto px-10 py-4 bg-black dark:bg-green-700 text-white font-bold uppercase tracking-widest text-[11px] rounded-sm hover:bg-green-800 dark:hover:bg-green-600 transition-all duration-300 shadow-lg">
                View Tournaments
              </button>
              <button className="w-full sm:w-auto px-10 py-4 border border-black/20 dark:border-white/20 text-black dark:text-white font-bold uppercase tracking-widest text-[11px] rounded-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300">
                Membership Info
              </button>
            </div>
          </motion.div>
        </div>

        {/* RIGHT IMAGE: High-End Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="lg:col-span-5 relative order-1 lg:order-2"
        >
          <div className="relative mx-auto w-[85%] md:w-[70%] lg:w-full">
            {/* The Frame Overlay */}
            <div className="absolute -inset-4 border border-gray-200 dark:border-white/5 -z-10" />
            
            <div className="aspect-[4/5] overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl">
              <motion.img 
                src={HeroImage} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out cursor-pointer" 
                alt="Karate Excellence"
                whileHover={{ scale: 1.05 }}
              />
            </div>

            {/* Subtle Corner Accents */}
            <div className="absolute -top-2 -right-2 w-16 h-16 border-t-4 border-r-4 border-green-700 dark:border-green-600" />
            <div className="absolute -bottom-2 -left-2 w-16 h-16 border-b-4 border-l-4 border-green-700 dark:border-green-600" />
            
            {/* Minimal Info Badge */}
            <div className="absolute -right-6 bottom-12 bg-black dark:bg-green-700 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest -rotate-90 origin-right">
              Est. 1965
            </div>
          </div>
        </motion.div>
      </div>

      {/* REFINED STATS: Professional Minimalist */}
      <div className="absolute bottom-0 w-full bg-white dark:bg-[#111] border-t border-black/5 dark:border-white/5 py-6 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-around">
          {[
            { n: '5000+', l: 'Registered Athletes' },
            { n: '50+', l: 'Training Centers' },
            { n: '100+', l: 'Annual Championships' }
          ].map((s, i) => (
            <div key={i} className="text-center group">
              <span className="block text-2xl font-black text-black dark:text-white group-hover:text-green-700 transition-colors">{s.n}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">{s.l}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default Hero;