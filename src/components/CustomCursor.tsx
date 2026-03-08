'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
    const move = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  if (!mounted || typeof window === 'undefined') return null

  // Only show on desktop (no hover on touch devices)
  const isTouch = 'ontouchstart' in window
  if (isTouch) return null

  return (
    <motion.div
      className="fixed w-8 h-8 pointer-events-none z-[9999] hidden md:block"
      animate={{ x: position.x - 16, y: position.y - 16 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-[#D4AF37] text-lg opacity-80">💍</span>
      </div>
    </motion.div>
  )
}
