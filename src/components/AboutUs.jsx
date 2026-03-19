import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import assets from '../assets/assets';
import { 
  RiTrophyLine, 
  RiGroupLine, 
  RiMedalLine, 
  RiGlobalLine,
  RiFocus3Line,
  RiArrowRightLine 
} from 'react-icons/ri';

const AboutUs = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const achievements = [
    { icon: <RiTrophyLine />, value: 'Gold', label: 'South Asian Games' },
    { icon: <RiGroupLine />, value: '160+', label: 'Affiliated Clubs' },
    { icon: <RiGlobalLine />, value: 'WKF', label: 'Official Member' },
    { icon: <RiMedalLine />, value: '1965', label: 'Founded Year' },
  ];

  return (
    <section
      id="about-us"
      ref={ref}
      className="relative w-full py-20 lg:py-32 overflow-hidden bg-white dark:bg-[#050505] transition-colors duration-700"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* LEFT: CONTENT AREA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
            className="lg:col-span-7"
          >
            {/* Tagline Badge */}
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1 bg-green-500/10 text-green-600 dark:text-green-500 text-[10px] font-bold uppercase tracking-[0.3em] rounded-full">
                Legacy of Honor
              </span>
            </div>

            {/* Heading - Balanced & Modern */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black dark:text-white leading-tight uppercase mb-6">
              Official Body of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">
                Pakistan Karate
              </span>
            </h2>

            {/* Informational Text from Official Context */}
            <div className="space-y-4 text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed">
              <p>
                The <span className="text-black dark:text-white font-bold">Pakistan Karate Federation (PKF)</span> is the sole governing body for the sport of Karate in Pakistan. Affiliated with the <span className="text-green-600 font-semibold">World Karate Federation (WKF)</span> and Asian Karate Federation, we have been nurturing world-class talent since our inception in 1965.
              </p>
              <p>
                Recognized by the Pakistan Sports Board and Pakistan Olympic Association, the PKF is dedicated to promoting the physical and mental discipline of Karate across all provinces, from grassroots dojos to international podiums.
              </p>
            </div>

            {/* Modern Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
              <div className="p-6 bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl group hover:border-green-500/50 transition-all">
                <RiFocus3Line className="text-3xl text-green-600 mb-3" />
                <h4 className="text-sm font-black text-black dark:text-white uppercase mb-1">Our Mission</h4>
                <p className="text-xs text-gray-500">To maintain the highest standards of Shotokan and other traditional styles while excelling in modern sports karate.</p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl group hover:border-green-500/50 transition-all">
                <RiGlobalLine className="text-3xl text-green-600 mb-3" />
                <h4 className="text-sm font-black text-black dark:text-white uppercase mb-1">Affiliations</h4>
                <p className="text-xs text-gray-500">Proud members of the South Asian Karate Federation and officially recognized by the Government of Pakistan.</p>
              </div>
            </div>

            <button className="mt-10 flex items-center gap-2 text-green-600 font-black uppercase tracking-widest text-[11px] hover:gap-4 transition-all">
              Learn More About PKF History <RiArrowRightLine />
            </button>
          </motion.div>

          {/* RIGHT: IMAGE & FLOATING STATS */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1 }}
            className="lg:col-span-5 relative"
          >
            {/* Main Image Frame */}
            <div className="relative rounded-[2rem] overflow-hidden border-8 border-white dark:border-[#111] shadow-2xl">
              <img 
                src={assets.Karate_Image} 
                alt="National Athletes" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Stats Overlay Grid */}
            <div className="absolute -bottom-10 inset-x-0 px-4">
              <div className="bg-white dark:bg-[#1a1a1a] shadow-xl rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4 border border-black/5 dark:border-white/10">
                {achievements.map((item, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-green-600 text-xl flex justify-center mb-1">{item.icon}</div>
                    <div className="text-lg font-black text-black dark:text-white">{item.value}</div>
                    <div className="text-[8px] font-bold uppercase tracking-widest text-gray-400">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-green-500/10 blur-[80px] -z-10 rounded-full" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutUs;