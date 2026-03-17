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
    { icon: <RiTrophyLine />, value: '50+', label: 'International Medals' },
    { icon: <RiTeamLine />, value: '1000+', label: 'Active Athletes' },
    { icon: <RiMedalLine />, value: '25+', label: 'National Titles' },
    { icon: <RiCalendarCheckLine />, value: '58', label: 'Years of Excellence' },
  ];

  const features = [
    {
      title: 'Elite Training Programs',
      description: 'World-class coaching facilities with international standard equipment and methodology.'
    },
    {
      title: 'National Championships',
      description: 'Annual tournaments showcasing the best talent from all provinces of Pakistan.'
    },
    {
      title: 'International Exposure',
      description: 'Regular participation in Asian Games, World Championships, and other global events.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.25, delayChildren: 0.4, ease: "easeInOut" } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeInOut" } }
  };

  return (
    <section
      id="about-us"
      ref={ref}
      className="relative w-full py-20 lg:py-28 overflow-hidden bg-white dark:bg-black transition-colors duration-700"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="flex-1 w-full"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#008000]/10 text-[#008000] text-sm font-semibold mb-6"
            >
              <RiShieldStarLine className="text-lg" />
              <span>Est. 1965 • Official National Federation</span>
            </motion.div>

            {/* Title */}
            <Title 
  title={
    <span>
      <span className="text-gray-900 dark:text-white">Pakistan </span>
      <span className="text-[#008000]">Karate Federation</span>
    </span>
  }
  desc="Empowering champions, preserving tradition, and building a legacy of excellence in martial arts since 1965. We are the official governing body for Karate in Pakistan, recognized by the Pakistan Sports Board and international karate organizations."
/>

            {/* Features */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="mt-8 space-y-4"
            >
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="flex items-start gap-3 group"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#008000]/10 flex items-center justify-center mt-1 group-hover:bg-[#008000]/20 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#008000]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.9, ease: "easeInOut" }}
              className="mt-8 group inline-flex items-center gap-2 px-6 py-3 bg-[#008000] hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-500 transform hover:scale-105 hover:shadow-xl"
            >
              <span>Discover Our Journey</span>
              <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Right Image & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 0.3 }}
            className="flex-1 w-full"
          >
            <motion.div 
              className="relative group rounded-2xl overflow-hidden shadow-2xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src={assets.karate_image} // your AI-generated image
                alt="Karate Practitioners"
                className="w-full h-auto object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#008000]/20 to-transparent mix-blend-overlay" />

              {/* Stats */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[90%] sm:w-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-white/90 dark:bg-black backdrop-blur-lg rounded-xl shadow-xl border border-gray-200 dark:border-black"
                >
                  {achievements.map((item, idx) => (
                    <div key={idx} className="text-center min-w-[80px]">
                      <div className="text-2xl text-[#008000] mb-1 flex justify-center">{item.icon}</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{item.value}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">{item.label}</div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.1, ease: "easeInOut" }}
          className="mt-24 text-center max-w-3xl mx-auto"
        >
          <p className="text-lg italic text-gray-600 dark:text-gray-300">
            "The ultimate aim of karate lies not in victory or defeat, but in the perfection of the character of its participants."
          </p>
          <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
            — Master Gichin Funakoshi
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;