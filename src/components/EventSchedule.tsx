'use client'

import { motion } from 'framer-motion'
import {
  Users,
  Heart,
  Wine,
  UtensilsCrossed,
  Music,
  Moon,
  LucideIcon,
} from 'lucide-react'
import { useSiteData } from '@/context/SiteDataContext'

const iconMap: Record<string, LucideIcon> = {
  Users,
  Heart,
  Wine,
  UtensilsCrossed,
  Music,
  Moon,
}

export default function EventSchedule() {
  const { config } = useSiteData()
  return (
    <section id="schedule" className="py-20 px-6 bg-[#FFFEF7]">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl text-center text-[#0f1729] mb-4 font-script"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Event Schedule
        </motion.h2>
        <motion.p
          className="text-center text-[#0f1729]/70 mb-16"
          style={{ fontFamily: 'Georgia, serif' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          A timeline of our special day
        </motion.p>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-[#D4AF37]/30 -translate-x-px md:-translate-x-1/2" />

          <div className="space-y-12">
            {config.events.map((event, i) => {
              const Icon = iconMap[event.icon] || Heart
              const isLeft = i % 2 === 0

              return (
                <motion.div
                  key={event.title}
                  className={`relative flex items-center gap-8 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  {/* Content card */}
                  <div
                    className={`flex-1 ${isLeft ? 'md:text-right md:pr-16' : 'md:pl-16 md:text-left'}`}
                  >
                    <div className="bg-[#0f1729] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                      <div
                        className={`flex items-center gap-3 ${isLeft ? 'md:flex-row-reverse' : ''}`}
                      >
                        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                        <div className={isLeft ? 'md:text-right' : ''}>
                          <span className="text-[#D4AF37] text-sm font-medium">
                            {event.time}
                          </span>
                          <h3 className="text-xl text-[#FFFEF7] mt-1">{event.title}</h3>
                          <p className="text-[#FFFEF7]/70 text-sm mt-1">{event.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div
                    className="absolute left-6 md:left-1/2 w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center -translate-x-1/2 z-10 border-4 border-[#FFFEF7]"
                    style={{ top: '50%', transform: 'translate(-50%, -50%)' }}
                  >
                    <Icon className="w-5 h-5 text-[#0f1729]" />
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
