import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Title from './Title';
import assets from '../assets/assets';
import { 
  RiTrophyLine, 
  RiTeamLine, 
  RiMedalLine, 
  RiCalendarCheckLine,
  RiArrowRightLine,
  RiShieldStarLine
} from 'react-icons/ri';

const AboutUs = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const achievements = [
    { icon: <RiTrophyLine />, value: '50+', label: 'Int. Medals' },
    { icon: <RiTeamLine />, value: '1000+', label: 'Athletes' },
    { icon: <RiMedalLine />, value: '25+', label: 'National Titles' },
    { icon: <RiCalendarCheckLine />, value: '58', label: 'Years' },
  ];

  const features = [
    {
      title: 'Elite Training Programs',
      description: 'World-class coaching facilities with international standard equipment.'
    },
    {
      title: 'National Championships',
      description: 'Annual tournaments showcasing the best talent from all provinces.'
    },
    {
      title: 'International Exposure',
      description: 'Regular participation in Asian Games and World Championships.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2, delayChildren: 0.3 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section
      id="about-us"
      ref={ref}
      className="relative w-full py-20 lg:py-32 overflow-hidden bg-white dark:bg-[#050505] transition-colors duration-700"
    >
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex-1 w-full order-2 lg:order-1"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#008000]/10 text-[#008000] text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
              <RiShieldStarLine className="text-sm" />
              <span>Official National Federation</span>
            </div>

            {/* Title Component */}
            <Title 
              title={
                <span className="text-4xl md:text-6xl font-black uppercase leading-tight block">
                  <span className="text-gray-900 dark:text-white">Pakistan </span>
                  <span className="text-[#008000] italic">Karate</span>
                </span>
              }
              desc="Empowering champions, preserving tradition, and building a legacy of excellence in martial arts since 1965. We are the official governing body for Karate in Pakistan."
            />

            {/* Features List */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="mt-10 space-y-6"
            >
              {features.map((feature, idx) => (
                <motion.div key={idx} variants={itemVariants} className="flex items-start gap-4 group">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-[#008000] group-hover:scale-150 transition-transform" />
                  <div>
                    <h3 className="font-black text-gray-900 dark:text-white uppercase text-xs tracking-widest">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.button
              whileHover={{ x: 5 }}
              className="mt-12 flex items-center gap-3 text-black dark:text-white font-black uppercase tracking-widest text-[11px] border-b-2 border-[#008000] pb-2 transition-all"
            >
              Discover Our Journey
              <RiArrowRightLine className="text-[#008000]" />
            </motion.button>
          </motion.div>

          {/* RIGHT IMAGE SECTION (The Modern Frame Design) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex-1 w-full relative order-1 lg:order-2"
          >
            <div className="relative w-full max-w-lg mx-auto group">
              
              {/* Decorative Background Accents */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border-t-4 border-r-4 border-[#008000] -z-10 opacity-30" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-4 border-l-4 border-[#008000] -z-10 opacity-30" />

              {/* Main Image Frame */}
              <div className="relative z-10 p-3 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 shadow-2xl">
                <div className="aspect-[4/5] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
                  <img
                    src={assets.karate_image} 
                    alt="Karate Heritage"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                  />
                </div>
              </div>

              {/* Floating Vertical Ribbon */}
              <div className="absolute -right-4 top-10 bg-[#008000] text-white py-6 px-2 [writing-mode:vertical-lr] rotate-180 uppercase font-black tracking-[0.3em] text-[9px] z-20 shadow-xl">
                Legacy • 1965
              </div>

              {/* Stats - Refined Grid Card */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[105%] md:w-[115%] z-30">
                <div className="bg-white dark:bg-[#1a1a1a] shadow-2xl p-6 border border-gray-100 dark:border-white/5 grid grid-cols-4 gap-2">
                  {achievements.map((item, idx) => (
                    <div key={idx} className="text-center group/stat">
                      <div className="text-[#008000] text-xl flex justify-center mb-1 group-hover/stat:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div className="text-lg font-black text-gray-900 dark:text-white leading-none">
                        {item.value}
                      </div>
                      <div className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter mt-1">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;