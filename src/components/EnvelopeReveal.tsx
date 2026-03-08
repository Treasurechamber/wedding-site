'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EnvelopeAnimation from './EnvelopeAnimation'
import { useSiteData } from '@/context/SiteDataContext'

interface EnvelopeRevealProps {
  children: React.ReactNode
}

export default function EnvelopeReveal({ children }: EnvelopeRevealProps) {
  const { config } = useSiteData()
  const [envelopeOpen, setEnvelopeOpen] = useState(false)
  const [showContent, setShowContent] = useState(false)

  const handleEnvelopeOpen = () => {
    setEnvelopeOpen(true)
    // Brief delay before showing main content
    setTimeout(() => setShowContent(true), 800)
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {!showContent && (
          <motion.div
            key="envelope"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {!envelopeOpen ? (
              <EnvelopeAnimation onComplete={handleEnvelopeOpen} />
            ) : (
              <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f1729]"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                onAnimationComplete={() => setShowContent(true)}
              >
                {/* Invitation card sliding out */}
                <motion.div
                  className="absolute w-[min(85vw,350px)] aspect-[3/4] rounded-lg overflow-hidden"
                  style={{
                    background: 'linear-gradient(180deg, #FFFEF7 0%, #f8f4ed 100%)',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                  }}
                  initial={{ y: 100, opacity: 0, rotateX: -20 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    rotateX: 0,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 20,
                  }}
                >
                  <div className="p-8 h-full flex flex-col items-center justify-center text-center">
                    <span
                      className="text-[#0f1729] text-4xl font-script block"
                    >
                      {config.couple.names.join(' & ')}
                    </span>
                    <span className="text-[#0f1729]/70 text-sm mt-4 tracking-widest uppercase">
                      {config.date.full}
                    </span>
                    <span className="text-[#D4AF37] text-xs mt-2 tracking-[0.2em]">
                      Together with their families
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      )}
    </>
  )
}
