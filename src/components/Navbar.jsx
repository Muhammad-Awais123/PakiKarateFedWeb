import React, { useState } from 'react'
import assets from '../assets/assets'
import ThemeToggleBtn from './ThemeToggleBtn'
import { motion } from "motion/react"

const Navbar = ({ theme, setTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('Home')

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Championships', href: '#services' },
    { name: 'Schedule', href: '#our-work' },
    { name: 'Results', href: '#products' },
    { name: 'Rankings', href: '#rankings' },
    { name: 'Registration', href: '#registration' },
    { name: 'News', href: '#news' },
    { name: 'About Us', href: '#about-us' },
    { name: 'Contact', href: '#contact-us' },
    { name: 'Login', href: '#login' },
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -70 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className='sticky top-0 z-50 flex justify-between items-center px-6 sm:px-12 lg:px-24 py-4 backdrop-blur-lg bg-white/20 dark:bg-gray-900/20 border-b border-gray-200 dark:border-gray-700 shadow-md'>

      {/* LOGO */}
      <motion.img
        src={theme === 'dark' ? assets.darlogo : assets.Logo}
        className='w-20 sm:w-24 cursor-pointer hover:scale-110 transition-transform duration-300'
        whileHover={{ scale: 1.1 }}
        alt='Logo'
      />

      {/* NAV LINKS */}
      <div className={`flex sm:items-center gap-8 text-gray-800 dark:text-white sm:text-base
        ${!sidebarOpen ? 'max-sm:w-0 overflow-hidden' : 'max-sm:w-64 max-sm:pl-8'}
        max-sm:fixed max-sm:top-0 max-sm:bottom-0 max-sm:right-0 max-sm:min-h-screen max-sm:h-full
        max-sm:flex-col max-sm:pt-24 max-sm:bg-[#008000]/90 max-sm:text-white transition-all duration-500`}>

        <img
          src={assets.close_icon}
          alt="close"
          className='w-6 absolute right-5 top-5 sm:hidden cursor-pointer hover:scale-110 transition-transform'
          onClick={() => setSidebarOpen(false)}
        />

        {navLinks.map((link) => (
          <a
            key={link.name}
            onClick={() => { setSidebarOpen(false); setActiveLink(link.name) }}
            href={link.href}
            className={`relative font-semibold transition-all duration-300 after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#008000] after:rounded-full after:transition-all after:duration-500 hover:after:w-full
              ${activeLink === link.name ? 'text-[#008000] after:w-full' : 'text-gray-800 dark:text-white hover:text-[#008000]'}`}
          >
            {link.name}
          </a>
        ))}
      </div>

      {/* RIGHT SIDE BUTTONS */}
      <div className='flex items-center gap-4 sm:gap-6'>
        <ThemeToggleBtn theme={theme} setTheme={setTheme} />

        <img
          src={theme === 'dark' ? assets.menu_icon_dark : assets.menu_icon}
          alt="menu"
          onClick={() => setSidebarOpen(true)}
          className='w-8 sm:hidden cursor-pointer hover:scale-110 transition-transform duration-300'
        />

        <a
          href="#contact-us"
          className={`hidden sm:flex items-center gap-2 px-6 py-2 rounded-full cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-300
            ${theme === 'dark' ? 'invisible' : 'bg-[#008000] text-white'}`}
        >
          Connect <img src={assets.arrow_icon} width={14} alt="arrow" />
        </a>
      </div>
    </motion.nav>
  )
}

export default Navbar