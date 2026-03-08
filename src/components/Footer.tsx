'use client'

import { useState, useRef } from 'react'
import { useAdmin } from '@/context/AdminContext'
import { useSiteData } from '@/context/SiteDataContext'

export default function Footer() {
  const { config } = useSiteData()
  const { openDashboard } = useAdmin()
  const [clickCount, setClickCount] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const handleInitialsClick = () => {
    const newCount = clickCount + 1
    setClickCount(newCount)

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setClickCount(0), 600)

    if (newCount >= 3) {
      openDashboard()
      setClickCount(0)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }

  return (
    <footer className="py-12 px-6 bg-[#0f1729] border-t border-[#D4AF37]/20">
      <div className="max-w-4xl mx-auto text-center">
        <button
          onClick={handleInitialsClick}
          className="text-4xl md:text-5xl text-[#D4AF37] hover:text-[#e5c158] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 rounded font-script"
          aria-label="Footer initials"
        >
          {config.couple.initials}
        </button>
        <p className="text-[#FFFEF7]/60 text-sm mt-4" style={{ fontFamily: 'Georgia, serif' }}>
          {config.couple.hashtag ? (
            <a
              href={`https://www.instagram.com/explore/tags/${encodeURIComponent(config.couple.hashtag.replace(/^#/, ''))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D4AF37] transition-colors"
            >
              {config.couple.hashtag.startsWith('#') ? config.couple.hashtag : `#${config.couple.hashtag}`}
            </a>
          ) : null}
        </p>
        <p className="text-[#FFFEF7]/40 text-xs mt-2">
          With love, {config.couple.names.join(' & ')}
        </p>
      </div>
    </footer>
  )
}
