'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSiteData } from '@/context/SiteDataContext'

const FLOAT_COUNT = 12
const SLIDE_DURATION_MS = 5000

export default function HeroSection() {
  const { config, heroSlides } = useSiteData()
  const [index, setIndex] = useState(0)
  const slides = heroSlides

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), SLIDE_DURATION_MS)
    return () => clearInterval(t)
  }, [slides.length])

  const go = (dir: -1 | 1) => setIndex((i) => (i + dir + slides.length) % slides.length)

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Hero image slider */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            <img
              src={slides[index]}
              alt=""
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-[#0f1729]/70" aria-hidden />
      </div>

      {/* Subtle overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 30%, transparent 0%, rgba(15,23,41,0.4) 100%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 12rem 4rem rgba(15,23,41,0.25)',
        }}
      />

      {/* Slider controls */}
      <div className="absolute inset-y-0 left-0 z-20 flex items-center pl-2 md:pl-4">
        <button
          type="button"
          onClick={() => go(-1)}
          className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/90 hover:text-white transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 z-20 flex items-center pr-2 md:pr-4">
        <button
          type="button"
          onClick={() => go(1)}
          className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/90 hover:text-white transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-6 bg-[#D4AF37]' : 'w-1.5 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: FLOAT_COUNT }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#D4AF37]"
            style={{
              width: 60 + (i % 4) * 40,
              height: 60 + (i % 4) * 40,
              left: `${10 + (i * 7) % 80}%`,
              top: `${15 + (i * 11) % 70}%`,
              opacity: 0.03 + (i % 3) * 0.02,
              filter: 'blur(40px)',
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -25, 15, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{
              duration: 12 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Typography */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <motion.p
          className="font-display text-[#D4AF37] text-xs sm:text-sm tracking-[0.35em] uppercase mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          We&apos;re Getting Married
        </motion.p>

        <motion.span
          className="font-script text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-[#FFFEF7] block"
          initial={{ opacity: 0, y: 24, letterSpacing: '0.2em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '0em' }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {config.couple.names[0]}
        </motion.span>

        <motion.span
          className="font-display text-[#D4AF37] text-2xl sm:text-3xl md:text-4xl my-3 tracking-widest"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          ✦ & ✦
        </motion.span>

        <motion.span
          className="font-script text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-[#FFFEF7] block"
          initial={{ opacity: 0, y: 24, letterSpacing: '0.2em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '0em' }}
          transition={{ duration: 1.2, delay: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {config.couple.names[1]}
        </motion.span>

        <motion.p
          className="font-display text-[#FFFEF7]/90 mt-12 text-base sm:text-lg tracking-[0.15em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2, ease: 'easeOut' }}
        >
          {config.date.full}
        </motion.p>
        <motion.p
          className="font-display text-[#D4AF37]/90 text-sm mt-1 tracking-[0.2em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.2, ease: 'easeOut' }}
        >
          {config.date.time}
        </motion.p>
        <motion.p
          className="font-display text-[#FFFEF7]/40 text-xs mt-6 tracking-[0.4em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.5, ease: 'easeOut' }}
        >
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
        </motion.p>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 6, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-px h-14 bg-gradient-to-b from-[#D4AF37]/70 to-transparent" />
      </motion.div>
    </section>
  )
}
