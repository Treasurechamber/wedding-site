'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useSiteData } from '@/context/SiteDataContext'

export default function FAQ() {
  const { config } = useSiteData()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 px-6 bg-[#0f1729]">
      <div className="max-w-2xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl text-center text-[#FFFEF7] mb-4 font-script"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          FAQs
        </motion.h2>
        <motion.p
          className="text-center text-[#FFFEF7]/70 mb-12"
          style={{ fontFamily: 'Georgia, serif' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Common questions
        </motion.p>

        <div className="space-y-4">
          {config.faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="rounded-xl border border-[#D4AF37]/20 overflow-hidden bg-[#1e3a5f]/30"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left text-[#FFFEF7] hover:bg-[#1e3a5f]/50 transition-colors"
              >
                <span className="font-medium">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#D4AF37] transition-transform ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p
                      className="px-6 pb-6 text-[#FFFEF7]/80"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
