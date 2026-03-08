'use client'

import { motion } from 'framer-motion'
import { Gift, ExternalLink } from 'lucide-react'
import { useSiteData } from '@/context/SiteDataContext'

export default function Registry() {
  const { config } = useSiteData()
  return (
    <section className="py-20 px-6 bg-[#FFFEF7]">
      <div className="max-w-2xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl text-center text-[#0f1729] mb-4 font-script"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Registry
        </motion.h2>
        <motion.p
          className="text-center text-[#0f1729]/70 mb-8"
          style={{ fontFamily: 'Georgia, serif' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {config.registry.message}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {config.registry.stores.map((store, i) => (
            <a
              key={store.name}
              href={store.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 rounded-xl bg-[#0f1729] text-[#FFFEF7] hover:bg-[#1e3a5f] hover:scale-105 transition-all"
            >
              <Gift className="w-6 h-6 text-[#D4AF37]" />
              <span>{store.name}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          ))}
        </motion.div>

        <motion.p
          className="text-center text-[#0f1729]/60 text-sm mt-8 italic"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Your presence at our wedding is the greatest gift of all.
        </motion.p>
      </div>
    </section>
  )
}
