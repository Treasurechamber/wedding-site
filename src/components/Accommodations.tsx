'use client'

import { motion } from 'framer-motion'
import { Hotel, MapPin, Phone, Tag } from 'lucide-react'
import { useSiteData } from '@/context/SiteDataContext'

export default function Accommodations() {
  const { config } = useSiteData()
  const acc = config.accommodations
  return (
    <section className="py-20 px-6 bg-[#0f1729]">
      <div className="max-w-2xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl text-center text-[#FFFEF7] mb-4 font-script"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Travel & Accommodations
        </motion.h2>
        <motion.p
          className="text-center text-[#FFFEF7]/70 mb-12"
          style={{ fontFamily: 'Georgia, serif' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Where to stay
        </motion.p>

        <motion.div
          className="bg-[#1e3a5f]/50 rounded-2xl p-8 border border-[#D4AF37]/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Hotel className="w-8 h-8 text-[#D4AF37]" />
            <h3 className="text-2xl text-[#FFFEF7]">{acc.hotel}</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <span className="text-[#FFFEF7]/90">{acc.address}</span>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <a href={`tel:${acc.phone}`} className="text-[#FFFEF7]/90 hover:text-[#D4AF37]">
                {acc.phone}
              </a>
            </div>
            <div className="flex items-start gap-3">
              <Tag className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <p className="text-[#FFFEF7]/90">
                Use block code <strong className="text-[#D4AF37]">{acc.blockCode}</strong> for{' '}
                <strong className="text-[#D4AF37]">{acc.discount}</strong> off your stay
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
