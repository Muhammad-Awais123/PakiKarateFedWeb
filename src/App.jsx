import React, { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

// Admin
import AdminLogin from "./components/admin/AdminLogin"
import AdminLayout from "./components/admin/AdminLayout"
import EventsManagement from "./components/admin/EventsManagement"
import RankingsManagement from "./components/admin/RankingsManagement"
import RegistrationsManagement from "./components/admin/RegistrationsManagement"
import PrivateRoute from "./components/admin/PrivateRoute"
import PlayersManagement from "./components/admin/PlayersManagement"
import CoachesManagement from "./components/admin/CoachesManagement"
import LegendsManagement from "./components/admin/LegendsManagement"
import ScheduleManagement from "./components/admin/ScheduleManagement"

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
import PublicLayout from "./components/PublicLayout"
import EventsPage from "./pages/Events"
import Schedule from "./pages/Schedule"
import Rankings from "./pages/Rankings"
import Players from "./pages/Players"
import Coaches from "./pages/Coaches"
import LegendsPage from "./pages/Legends"
import DashboardOverview from "./pages/admin/DashboardOverview"

const App = () => {
  const adminPath = import.meta.env.VITE_ADMIN_PATH || "/admin/login";

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
      <Routes>
        {/* Admin Panel (separate chrome) */}
        <Route
          path={adminPath}
          element={
            localStorage.getItem("adminToken")
              ? <Navigate to="/admin/dashboard/events" replace />
              : <AdminLogin />
          }
        />
        <Route element={<PrivateRoute />}>
          <Route path="/admin/dashboard" element={<AdminLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="events" element={<EventsManagement />} />
            <Route path="rankings" element={<RankingsManagement />} />
            <Route path="registrations" element={<RegistrationsManagement />} />
            <Route path="players" element={<PlayersManagement />} />
            <Route path="coaches" element={<CoachesManagement />} />
            <Route path="legends" element={<LegendsManagement />} />
            <Route path="schedule" element={<ScheduleManagement />} />
          </Route>
        </Route>

        {/* User/Public Panel (website chrome) */}
        <Route
          element={
            <PublicLayout
              theme={theme}
              setTheme={setTheme}
              dotRef={dotRef}
              outlineRef={outlineRef}
            />
          }
        >
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/players" element={<Players />} />
          <Route path="/coaches" element={<Coaches />} />
          <Route path="/legends" element={<LegendsPage />} />
          <Route
            path="/"
            element={
              <>
                <Hero />
                <AboutUs />
                <Events />
                <WorldRankings />
                <Legends />
                <FAQ />
                <ContactUs />
              </>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App