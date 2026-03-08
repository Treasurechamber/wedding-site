'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useMutation } from 'convex/react'
import { api } from 'convex/_generated/api'

const rsvpSchema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  attending: z.union([z.boolean(), z.string()]).transform((v) => v === true || v === 'true'),
  guest_count: z.number().min(1).max(10),
  plus_one_name: z.string().optional(),
  message: z.string().optional(),
})

type RSVPFormData = z.infer<typeof rsvpSchema>

export default function RSVPForm() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const createRsvp = useMutation(api.rsvps.create)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RSVPFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      attending: true,
      guest_count: 1,
    },
  })

  const attending = watch('attending')

  const onSubmit = async (data: RSVPFormData) => {
    setError(null)
    try {
      await createRsvp({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone || undefined,
        attending: data.attending,
        guest_count: data.guest_count,
        plus_one_name: data.plus_one_name || undefined,
        message: data.message || undefined,
      })
      setSubmitted(true)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFFEF7', '#0f1729'],
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (submitted) {
    return (
      <motion.section
        className="py-20 px-6 bg-[#0f1729]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 mx-auto rounded-full bg-[#D4AF37]/20 flex items-center justify-center mb-8"
          >
            <span className="text-5xl">💒</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl text-[#FFFEF7] font-script">
            Thank You!
          </h2>
          <p className="text-[#FFFEF7]/80 mt-4" style={{ fontFamily: 'Georgia, serif' }}>
            Your response has been received. We can&apos;t wait to celebrate with you!
          </p>
        </div>
      </motion.section>
    )
  }

  return (
    <section className="py-20 px-6 bg-[#0f1729]" id="rsvp">
      <div className="max-w-2xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl text-center text-[#FFFEF7] mb-4 font-script"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          RSVP
        </motion.h2>
        <motion.p
          className="text-center text-[#FFFEF7]/70 mb-12"
          style={{ fontFamily: 'Georgia, serif' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Please respond by August 14, 2025
        </motion.p>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {error && (
            <div className="p-4 rounded-lg bg-red-500/20 text-red-200 text-sm">{error}</div>
          )}

          <div>
            <label className="block text-[#FFFEF7]/90 text-sm mb-2">Full Name(s) *</label>
            <input
              {...register('full_name')}
              className="w-full px-4 py-3 rounded-lg bg-[#1e3a5f]/50 border border-[#D4AF37]/30 text-[#FFFEF7] placeholder-[#FFFEF7]/40 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 outline-none transition-all"
              placeholder="John & Jane Doe"
            />
            {errors.full_name && (
              <p className="text-red-400 text-sm mt-1">{errors.full_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[#FFFEF7]/90 text-sm mb-2">Email *</label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-4 py-3 rounded-lg bg-[#1e3a5f]/50 border border-[#D4AF37]/30 text-[#FFFEF7] placeholder-[#FFFEF7]/40 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 outline-none transition-all"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[#FFFEF7]/90 text-sm mb-2">Phone</label>
            <input
              {...register('phone')}
              type="tel"
              className="w-full px-4 py-3 rounded-lg bg-[#1e3a5f]/50 border border-[#D4AF37]/30 text-[#FFFEF7] placeholder-[#FFFEF7]/40 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 outline-none transition-all"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-[#FFFEF7]/90 text-sm mb-3">Will you be attending? *</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register('attending')}
                  value="true"
                  className="w-4 h-4 text-[#D4AF37] focus:ring-[#D4AF37]"
                />
                <span className="text-[#FFFEF7]">Yes, I&apos;ll be there!</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register('attending')}
                  value="false"
                  className="w-4 h-4 text-[#D4AF37] focus:ring-[#D4AF37]"
                />
                <span className="text-[#FFFEF7]">Sorry, I can&apos;t make it</span>
              </label>
            </div>
          </div>

          {attending && (
            <>
              <div>
                <label className="block text-[#FFFEF7]/90 text-sm mb-2">
                  Number of guests *
                </label>
                <select
                  {...register('guest_count', { valueAsNumber: true })}
                  className="w-full px-4 py-3 rounded-lg bg-[#1e3a5f]/50 border border-[#D4AF37]/30 text-[#FFFEF7] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 outline-none transition-all"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'guest' : 'guests'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#FFFEF7]/90 text-sm mb-2">Plus One Name</label>
                <input
                  {...register('plus_one_name')}
                  className="w-full px-4 py-3 rounded-lg bg-[#1e3a5f]/50 border border-[#D4AF37]/30 text-[#FFFEF7] placeholder-[#FFFEF7]/40 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 outline-none transition-all"
                  placeholder="If applicable"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-[#FFFEF7]/90 text-sm mb-2">
              Special Message to the Couple
            </label>
            <textarea
              {...register('message')}
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-[#1e3a5f]/50 border border-[#D4AF37]/30 text-[#FFFEF7] placeholder-[#FFFEF7]/40 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 outline-none transition-all resize-none"
              placeholder="Share your well wishes..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-[#D4AF37] text-[#0f1729] font-semibold hover:bg-[#e5c158] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send RSVP'}
          </button>
        </motion.form>
      </div>
    </section>
  )
}
