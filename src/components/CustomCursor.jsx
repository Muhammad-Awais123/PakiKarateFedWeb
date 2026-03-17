// src/components/CustomCursor.jsx
import React, { useEffect, useRef } from 'react'

const CustomCursor = ({ theme }) => {
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
      position.current.x += (mouse.current.x - position.current.x) * 0.1
      position.current.y += (mouse.current.y - position.current.y) * 0.1

      if (dotRef.current && outlineRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x - 6}px, ${mouse.current.y - 6}px, 0)`
        outlineRef.current.style.transform = `translate3d(${position.current.x - 20}px, ${position.current.y - 20}px, 0)`
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 h-3 w-3 rounded-full pointer-events-none z-[9999]`}
        style={{
          backgroundColor: theme === 'dark' ? '#00ff00' : '#008000',
          transition: 'background-color 0.3s',
        }}
      ></div>

      {/* Outline */}
      <div
        ref={outlineRef}
        className={`fixed top-0 left-0 h-10 w-10 rounded-full border pointer-events-none z-[9998]`}
        style={{
          borderColor: theme === 'dark' ? '#00ff00' : '#008000',
          transition: 'border-color 0.3s',
        }}
      ></div>
    </>
  )
}

export default CustomCursor