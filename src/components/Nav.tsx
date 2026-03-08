'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useSiteData } from '@/context/SiteDataContext'

const navLinks = [
  { href: '#countdown', label: 'Countdown' },
  { href: '#venue', label: 'Venues' },
  { href: '#schedule', label: 'Schedule' },
  { href: '#story', label: 'Our Story' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#rsvp', label: 'RSVP' },
  { href: '#faq', label: 'FAQs' },
]

export default function Nav() {
  const { config } = useSiteData()
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a
            href="#"
            className="text-xl text-[#FFFEF7] hover:text-[#D4AF37] transition-colors font-script"
          >
            {config.couple.initials}
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[#FFFEF7]/90 hover:text-[#D4AF37] text-sm tracking-wider transition-colors"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-[#FFFEF7] hover:text-[#D4AF37]"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="absolute top-20 right-6 left-6 bg-[#0f1729] rounded-2xl p-8 border border-[#D4AF37]/20"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-[#FFFEF7] hover:text-[#D4AF37] py-2 transition-colors"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
