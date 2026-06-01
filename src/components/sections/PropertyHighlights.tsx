'use client'
import { motion }   from 'framer-motion'
import { PROPERTY } from '@/constants/property'

const stats = [
  { value: PROPERTY.stats.size,                  label: 'Apartment' },
  { value: `${PROPERTY.stats.bedrooms} Bed`,     label: '+ Living Room' },
  { value: `${PROPERTY.stats.maxGuests} Guests`, label: 'Max capacity' },
  { value: `★ ${PROPERTY.stats.rating}`,         label: `${PROPERTY.stats.reviewCount} reviews` },
]

export default function PropertyHighlights() {
  return (
    <section className="border-b border-[rgba(193,120,91,0.12)] bg-[#fdfaf6]">
      <div className="max-w-5xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[rgba(193,120,91,0.12)]">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col items-center justify-center py-7 px-4 text-center"
            >
              <span className="font-serif text-2xl text-[#2c2420]" style={{ fontWeight: 300 }}>{s.value}</span>
              <span className="text-[#8c7e78] text-[10px] mt-1.5 uppercase tracking-[0.14em] font-sans font-light">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
