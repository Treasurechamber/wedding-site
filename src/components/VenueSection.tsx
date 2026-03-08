'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, ExternalLink } from 'lucide-react'
import { useSiteData } from '@/context/SiteDataContext'

export default function VenueSection() {
  const { config, ceremonyImage, receptionImage } = useSiteData()
  const venues = [
    { ...config.venues.ceremony, label: 'Ceremony' as const, image: ceremonyImage },
    { ...config.venues.reception, label: 'Reception' as const, image: receptionImage },
  ]
  return (
    <section id="venue" className="py-20 px-6 bg-[#0f1729]">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl text-center text-[#FFFEF7] mb-4 font-script"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Venues
        </motion.h2>
        <motion.p
          className="text-center text-[#FFFEF7]/70 mb-16"
          style={{ fontFamily: 'Georgia, serif' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Join us at these beautiful locations
        </motion.p>

        <div className="grid md:grid-cols-2 gap-8">
          {venues.map((venue, i) => (
            <motion.div
              key={venue.name}
              className="rounded-2xl overflow-hidden bg-[#1e3a5f]/50 backdrop-blur border border-[#D4AF37]/20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="h-48 bg-[#1e3a5f] relative overflow-hidden">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8">
                <span className="text-[#D4AF37] text-sm tracking-widest uppercase">
                  {venue.label}
                </span>
                <h3 className="text-2xl text-[#FFFEF7] mt-2 font-serif">{venue.name}</h3>

                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <span className="text-[#FFFEF7]/90">{venue.time}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <span className="text-[#FFFEF7]/90">{venue.address}</span>
                  </div>
                </div>

                <a
                  href={venue.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#e5c158] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Get Directions
                </a>
              </div>

              {/* Embedded map */}
              <div className="p-4 pt-0">
                <div className="aspect-video rounded-lg overflow-hidden bg-[#0f1729]">
                  <iframe
                    src={venue.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map for ${venue.name}`}
                    className="grayscale opacity-80 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
