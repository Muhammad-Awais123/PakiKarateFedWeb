import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import assets from '../assets/assets';
import { 
  RiTrophyLine, 
  RiTeamLine, 
  RiMedalLine, 
  RiHistoryLine,
  RiArrowRightUpLine
} from 'react-icons/ri';

const AboutUs = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const achievements = [
    { icon: <RiTrophyLine />, value: '50+', label: 'Int. Medals' },
    { icon: <RiTeamLine />, value: '12k', label: 'Athletes' },
    { icon: <RiMedalLine />, value: '25+', label: 'Titles' },
    { icon: <RiHistoryLine />, value: '58', label: 'Years' },
  ];

  return (
    <section
      id="about-us"
      ref={ref}
      className="relative w-full py-24 lg:py-32 overflow-hidden bg-[#fafafa] dark:bg-[#080808] transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* LEFT: IMAGE COMPOSITION (Hero Style Frame) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
            className="lg:col-span-5 relative order-2 lg:order-1"
          >
            <div className="relative group">
              {/* Main Frame */}
              <div className="relative z-10 p-3 border border-black/5 dark:border-white/5 bg-white dark:bg-[#111] shadow-2xl">
                <div className="aspect-[4/5] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
                  <img
                    src={assets.karate_image}
                    alt="Karate Heritage"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Decorative Accents (Hero match) */}
              <div className="absolute -top-4 -left-4 w-20 h-20 border-t-4 border-l-4 border-green-700 dark:border-green-600 -z-10" />
              <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b-4 border-r-4 border-green-700 dark:border-green-600 -z-10" />
              
              {/* Floating Stats Card (Professional Look) */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-10 -left-6 lg:-left-12 bg-white dark:bg-[#1a1a1a] p-6 shadow-xl border border-black/5 dark:border-white/10 hidden md:block"
              >
                <div className="grid grid-cols-2 gap-8">
                  {achievements.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-green-700 dark:text-green-500 text-2xl mb-1 flex justify-center">{item.icon}</div>
                      <div className="text-xl font-black text-black dark:text-white">{item.value}</div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{item.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT: TEXT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
            className="lg:col-span-7 order-1 lg:order-2"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[2px] w-10 bg-green-700 dark:bg-green-500" />
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">
                Our Legacy
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-black dark:text-white leading-tight uppercase mb-8">
              Guarding the <br />
              <span className="text-green-700 dark:text-green-500 italic">Spirit</span> of Karate
            </h2>

            <div className="space-y-6 text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed font-medium">
              <p>
                Since <span className="text-black dark:text-white font-bold">1965</span>, the Pakistan Karate Federation (PKF) has stood as the ultimate guardian of martial arts excellence. We are the official governing body recognized by the Pakistan Sports Board.
              </p>
              <p>
                Our mission transcends beyond the tatami. We forge character, discipline, and national pride through world-class training programs and international-standard championships.
              </p>
            </div>

            {/* Feature List (Refined) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <div className="p-5 border-l-2 border-green-700 bg-black/5 dark:bg-white/5">
                <h4 className="text-sm font-black text-black dark:text-white uppercase mb-2">Elite Coaching</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">International standard equipment and Olympic-grade methodology.</p>
              </div>
              <div className="p-5 border-l-2 border-green-700 bg-black/5 dark:bg-white/5">
                <h4 className="text-sm font-black text-black dark:text-white uppercase mb-2">Global Stage</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Representing Pakistan in Asian Games and World Championships.</p>
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ x: 10 }}
              className="mt-12 flex items-center gap-4 text-black dark:text-white font-black uppercase tracking-widest text-[11px] border-b-2 border-black dark:border-white pb-2 hover:border-green-700 dark:hover:border-green-500 transition-all"
            >
              Explore Our History
              <RiArrowRightUpLine className="text-xl text-green-700 dark:text-green-500" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* BACKGROUND DECORATION (Subtle Vertical Text) */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:block pointer-events-none">
        <span className="text-[100px] font-black text-black/5 dark:text-white/[0.03] uppercase [writing-mode:vertical-lr]">
          BUSHIDO
        </span>
      </div>
    </section>
  );
};

export default AboutUs;