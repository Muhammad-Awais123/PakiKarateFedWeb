import React from 'react'
import { motion } from "motion/react"

const companies = [
  "Laidesx Mart",
  "Vergeoil Store",
  "Texan Hill",
  "BrandForge Media",
  "SparkHaven Marketing",
  "NovaPulse Agency",
  "EchoWave Digital",
  "VibeCraft Strategies"
]

const TrustedBy = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className='flex flex-col items-center px-4 sm:px-12 lg:px-24 xl:px-40 gap-10 text-gray-700 dark:text-white/80'
    >
      <motion.h3 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className='font-semibold text-lg sm:text-xl'
      >
        Trusted by Leading Companies
      </motion.h3>

      {/* ✅ Marquee wrapper */}
      <div className="overflow-hidden w-full py-2 relative">
        <motion.div
          className="flex gap-6 sm:gap-10 whitespace-nowrap"
          animate={{ x: ["0%", "-100%"] }}
          transition={{ duration: 15, ease: "linear", repeat: Infinity }}
        >
          {/* ✅ List twice for seamless loop */}
          {[...companies, ...companies].map((name, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className='px-4 py-2 rounded-lg border border-gray-300 dark:border-white/20 hover:scale-105 transition-transform cursor-default'
            >
              {name}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default TrustedBy
