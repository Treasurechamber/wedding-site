'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useSiteData } from '@/context/SiteDataContext'

export default function Gallery() {
  const { gallery } = useSiteData()
  const galleryImages = gallery.map((src, i) => ({ id: i + 1, src }))
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <section id="gallery" className="py-20 px-6 bg-[#FFFEF7]">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl text-center text-[#0f1729] mb-4 font-script"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Gallery
        </motion.h2>
        <motion.p
          className="text-center text-[#0f1729]/70 mb-12"
          style={{ fontFamily: 'Georgia, serif' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Our favorite moments
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((img, i) => (
            <motion.button
              key={img.id}
              className="aspect-square rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(img.id)}
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={img.src}
                alt={`Gallery ${img.id}`}
                className="w-full h-full object-cover"
              />
            </motion.button>
          ))}
        </div>

        <p className="text-center text-[#0f1729]/50 text-sm mt-6">
          Photos managed in Master dashboard (<code className="bg-[#0f1729]/10 px-1 rounded">/master</code>)
        </p>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="max-w-4xl max-h-[90vh] w-full rounded-xl overflow-hidden bg-[#0f1729]"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={galleryImages.find((i) => i.id === selected)?.src}
                alt="Gallery"
                className="w-full h-full max-h-[90vh] object-contain"
              />
            </motion.div>
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
