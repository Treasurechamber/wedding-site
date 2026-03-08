'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSiteData } from '@/context/SiteDataContext'

interface EnvelopeAnimationProps {
  onComplete: () => void
}

export default function EnvelopeAnimation({ onComplete }: EnvelopeAnimationProps) {
  const { config } = useSiteData()
  const [isOpening, setIsOpening] = useState(false)

  const handleClick = () => {
    if (isOpening) return
    setIsOpening(true)
    setTimeout(onComplete, 2500)
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f1729]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative cursor-pointer" onClick={handleClick}>
        {/* Envelope container - perspective for 3D effect */}
        <div className="relative w-[min(90vw,400px)] aspect-[1.4]" style={{ perspective: '1200px' }}>
          {/* Envelope back */}
          <motion.div
            className="absolute inset-0 rounded-sm overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #e8e0d5 0%, #ddd5c8 100%)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            }}
          />

          {/* Envelope flap - lifts up in 3D */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1/2 origin-top overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #f8f4ed 0%, #e8e0d5 50%, #ddd5c8 100%)',
              clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
              boxShadow: '0 -2px 15px rgba(0,0,0,0.2)',
              backfaceVisibility: 'hidden',
            }}
            animate={isOpening ? { rotateX: -150 } : {}}
            transition={{
              duration: 1.2,
              ease: [0.4, 0, 0.2, 1],
            }}
          />

          {/* Inner card - slides out */}
          <AnimatePresence>
            {isOpening && (
              <motion.div
                className="absolute inset-4 flex flex-col items-center justify-center rounded-md overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, #FFFEF7 0%, #f8f4ed 100%)',
                  boxShadow: 'inset 0 0 30px rgba(0,0,0,0.05)',
                }}
                initial={{ y: 50, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                transition={{
                  delay: 0.6,
                  duration: 0.8,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <motion.span
                  className="text-[#0f1729] text-3xl md:text-4xl font-script"
                >
                  {config.couple.names.join(' & ')}
                </motion.span>
                <motion.span
                  className="text-[#0f1729]/70 text-sm mt-3 tracking-[0.3em] uppercase"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {config.date.full}
                </motion.span>
                <motion.span
                  className="text-[#D4AF37] text-xs mt-2 tracking-[0.2em]"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  You&apos;re cordially invited
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wax seal - only visible when not opening */}
          {!isOpening && (
            <motion.div
              className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center z-10"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #c9a227, #8b6914)',
                boxShadow:
                  'inset -3px -3px 6px rgba(0,0,0,0.3), inset 3px 3px 6px rgba(255,255,255,0.2), 0 4px 15px rgba(0,0,0,0.4)',
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="text-white text-xl font-serif font-bold whitespace-nowrap">
                {config.couple.initials || config.couple.names.map((n) => n?.[0] ?? '').join('&')}
              </span>
            </motion.div>
          )}

          {/* "You're Invited" - visible when not opening */}
          {!isOpening && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span
                className="text-[#0f1729]/80 text-xs tracking-[0.4em] uppercase"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                You&apos;re Invited
              </span>
            </motion.div>
          )}
        </div>

        {/* Click hint */}
        {!isOpening && (
          <>
            <motion.p
              className="text-[#D4AF37]/80 text-sm mt-8 text-center"
              style={{ fontFamily: 'Georgia, serif' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Click to open invitation
            </motion.p>
            <button
              type="button"
              onClick={() => { setIsOpening(true); onComplete(); }}
              className="block w-full mt-4 text-[#FFFEF7]/50 hover:text-[#FFFEF7]/80 text-xs transition-colors"
            >
              Skip to site
            </button>
          </>
        )}

        {isOpening && (
          <motion.p
            className="text-[#D4AF37]/80 text-sm mt-8 text-center"
            style={{ fontFamily: 'Georgia, serif' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Welcome to our celebration
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}
