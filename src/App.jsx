import React, { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"

// Admin
import AdminLogin from "./components/admin/AdminLogin"
import AdminLayout from "./components/admin/AdminLayout"
import EventsManagement from "./components/admin/EventsManagement"
import RankingsManagement from "./components/admin/RankingsManagement"
import RegistrationsManagement from "./components/admin/RegistrationsManagement"

// Public
import AboutUs from './components/AboutUs'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Events from './components/Events'
import WorldRankings from './components/WorldRankings'
import ContactUs from './components/ContactUs'
import Footer from './components/Footer'
import EventDetail from './pages/EventDetail'

import { Toaster } from 'react-hot-toast'
import FAQ from './components/FAQs'
import Legends from './components/Legends'

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  const dotRef = useRef(null)
  const outlineRef = useRef(null)

  const mouse = useRef({ x: 0, y: 0 })
  const position = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    document.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      position.current.x += (mouse.current.x - position.current.x) * 0.15
      position.current.y += (mouse.current.y - position.current.y) * 0.15

      if (dotRef.current && outlineRef.current) {
        // Small Dot follows mouse exactly
        dotRef.current.style.transform = `translate3d(${mouse.current.x - 5}px, ${mouse.current.y - 5}px, 0)`

        // Outline has slight delay
        outlineRef.current.style.transform = `translate3d(${position.current.x - 20}px, ${position.current.y - 20}px, 0)`
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Hover effect for interactive elements
  useEffect(() => {
    const interactiveElements = document.querySelectorAll('a, button')
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (outlineRef.current) outlineRef.current.style.transform += ' scale(1.5)'
        if (dotRef.current) dotRef.current.style.transform += ' scale(1.2)'
      })
      el.addEventListener('mouseleave', () => {
        if (outlineRef.current) outlineRef.current.style.transform = outlineRef.current.style.transform.replace(' scale(1.5)', '')
        if (dotRef.current) dotRef.current.style.transform = dotRef.current.style.transform.replace(' scale(1.2)', '')
      })
    })
  }, [])

  return (
    <BrowserRouter>
      <Toaster />
      <div className='dark:bg-black relative'>
        <Navbar theme={theme} setTheme={setTheme} />

        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminLayout />}>
            <Route path="events" element={<EventsManagement />} />
            <Route path="rankings" element={<RankingsManagement />} />
            <Route path="registrations" element={<RegistrationsManagement />} />
          </Route>

          {/* Public Routes */}
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/" element={
            <>
              <Hero />
              <AboutUs />
              <Events />
              <WorldRankings />
              <Legends/>
              <FAQ/>
              <ContactUs />
            </>
          } />
        </Routes>

        <Footer theme={theme} />

        {/* Custom Cursor Outline */}
        <div
          ref={outlineRef}
          className='fixed top-0 left-0 h-10 w-10 rounded-full border pointer-events-none z-[9999]'
          style={{
            borderColor: theme === 'dark' ? '#00ff00' : '#008000',
            transition: 'border-color 0.2s, transform 0.1s ease-out',
          }}
        ></div>

        {/* Custom Cursor Dot */}
        <div
          ref={dotRef}
          className='fixed top-0 left-0 h-3 w-3 rounded-full pointer-events-none z-[9999]'
          style={{
            backgroundColor: theme === 'dark' ? '#00ff00' : '#008000',
            transition: 'background-color 0.2s, transform 0.1s ease-out',
          }}
        ></div>
      </div>
    </BrowserRouter>
  )
}

export default App