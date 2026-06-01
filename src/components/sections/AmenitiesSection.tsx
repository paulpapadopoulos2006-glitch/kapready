'use client'
import { motion }   from 'framer-motion'
import { PROPERTY } from '@/constants/property'

export default function AmenitiesSection() {
  return (
    <section id="amenities" className="py-24 lg:py-32 bg-[#fdfaf6]">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[10px] tracking-[0.2em] uppercase font-sans font-medium text-[#c1785b] mb-4">
            What's included
          </p>
          <div className="w-10 h-px bg-[#c1785b] mx-auto mb-6" />
          <h2
            className="font-serif text-[#2c2420]"
            style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 300 }}
          >
            Everything You <em className="italic" style={{ color: '#c1785b' }}>Need</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PROPERTY.amenities.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#f5efe6] hover:bg-[rgba(193,120,91,0.08)] transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-[rgba(193,120,91,0.2)]"
            >
              <span className="text-3xl mb-3">{a.icon}</span>
              <span className="font-sans font-medium text-[#2c2420] text-sm leading-snug">{a.label}</span>
              <span className="text-[#8c7e78] text-[11px] font-sans font-light mt-1 leading-snug">{a.desc}</span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
