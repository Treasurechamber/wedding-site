'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSiteData } from '@/context/SiteDataContext'

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const target = new Date(targetDate).getTime()

    const update = () => {
      const now = Date.now()
      const diff = Math.max(0, target - now)

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }

    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return { ...timeLeft, mounted }
}

const units = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
] as const

export default function CountdownTimer() {
  const { config } = useSiteData()
  const countdown = useCountdown(config.date.iso)

  if (!countdown.mounted) {
    return (
      <section id="countdown" className="py-20 px-6 bg-[#FFFEF7]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center text-[#0f1729] mb-12 font-script">
            Counting Down
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {[0, 0, 0, 0].map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl bg-[#0f1729]/5 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="countdown" className="py-20 px-6 bg-[#FFFEF7]">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl text-center text-[#0f1729] mb-12 font-script"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Counting Down to Our Special Day
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {units.map(({ key, label }, i) => (
            <motion.div
              key={key}
              className="relative overflow-hidden rounded-2xl bg-[#0f1729] p-6 md:p-8 text-center shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, boxShadow: '0 25px 50px -12px rgba(15,23,41,0.25)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent" />
              <motion.span
                key={countdown[key]}
                className="block text-4xl md:text-5xl lg:text-6xl font-bold text-[#D4AF37]"
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                {String(countdown[key]).padStart(2, '0')}
              </motion.span>
              <span
                className="block mt-2 text-[#FFFEF7]/80 text-sm tracking-widest uppercase"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {label}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-center text-[#0f1729]/70 mt-8"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {config.date.full} at {config.date.time}
        </motion.p>
      </div>
    </section>
  )
}
