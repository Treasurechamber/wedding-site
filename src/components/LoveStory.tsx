'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useSiteData } from '@/context/SiteDataContext'

export default function LoveStory() {
  const { config } = useSiteData()
  return (
    <section id="story" className="py-20 px-6 bg-[#FFFEF7]">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl text-center text-[#0f1729] mb-4 font-script"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Our Love Story
        </motion.h2>
        <motion.p
          className="text-center text-[#0f1729]/70 mb-16"
          style={{ fontFamily: 'Georgia, serif' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          The journey to forever
        </motion.p>

        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-[#D4AF37]/30 -translate-x-1/2" />

          <div className="space-y-12">
            {config.loveStory.map((story, i) => {
              const isLeft = i % 2 === 0
              return (
                <motion.div
                  key={story.year}
                  className={`relative flex items-center gap-8 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div
                    className={`flex-1 ${isLeft ? 'md:text-right md:pr-20' : 'md:pl-20 md:text-left'}`}
                  >
                    <div className="bg-[#0f1729] rounded-2xl p-6 shadow-lg">
                      <span className="text-[#D4AF37] font-bold">{story.year}</span>
                      <h3 className="text-xl text-[#FFFEF7] mt-2">{story.title}</h3>
                      <p className="text-[#FFFEF7]/80 mt-2" style={{ fontFamily: 'Georgia, serif' }}>
                        {story.description}
                      </p>
                    </div>
                  </div>
                  <div
                    className="absolute left-8 md:left-1/2 w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center -translate-x-1/2 z-10"
                    style={{ top: '50%', transform: 'translate(-50%, -50%)' }}
                  >
                    <Heart className="w-4 h-4 text-[#0f1729]" />
                  </div>
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
