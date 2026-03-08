'use client'

import { motion } from 'framer-motion'
import { Mail, Heart } from 'lucide-react'
export default function Contact() {
  return (
    <section className="py-20 px-6 bg-[#FFFEF7]">
      <div className="max-w-xl mx-auto text-center">
        <motion.h2
          className="text-3xl md:text-4xl text-[#0f1729] mb-4 font-script"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Get in Touch
        </motion.h2>
        <motion.p
          className="text-[#0f1729]/70 mb-8"
          style={{ fontFamily: 'Georgia, serif' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Questions? Reach out to us
        </motion.p>

        <motion.a
          href="mailto:hello@wedding.com"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#0f1729] text-[#FFFEF7] hover:bg-[#1e3a5f] transition-colors"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
        >
          <Mail className="w-5 h-5 text-[#D4AF37]" />
          hello@wedding.com
        </motion.a>

        <motion.p
          className="mt-12 text-[#0f1729]/60 flex items-center justify-center gap-2"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          <Heart className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
          We can&apos;t wait to celebrate with you
        </motion.p>
      </div>
    </section>
  )
}
