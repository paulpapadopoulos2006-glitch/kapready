'use client'
import { motion }   from 'framer-motion'
import { PROPERTY } from '@/constants/property'

export default function ReviewsSection() {
  return (
    <section id="reviews" className="py-24 lg:py-32 bg-[#2c2420]">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[10px] tracking-[0.2em] uppercase font-sans font-light text-[#c1785b] mb-5">
            Guest Reviews
          </p>
          <div className="flex items-baseline justify-center gap-3 mb-3">
            <span className="font-serif text-white" style={{ fontSize: '5rem', fontWeight: 300, lineHeight: 1 }}>
              {PROPERTY.stats.rating}
            </span>
            <span className="font-serif text-[#c1785b] text-2xl" style={{ fontWeight: 300 }}>/ 5</span>
          </div>
          <div className="flex justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-[#c1785b]">★</span>
            ))}
          </div>
          <p className="text-white/40 text-xs tracking-[0.14em] uppercase font-sans font-light">
            {PROPERTY.stats.reviewCount} verified guest stays
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {PROPERTY.reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="border border-white/8 rounded-2xl p-7 flex flex-col gap-5"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-sans font-medium text-white text-sm">{r.author}</p>
                  <p className="text-white/35 text-xs font-sans font-light mt-0.5">{r.country} · {r.stayType}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#c1785b] font-serif text-lg" style={{ fontWeight: 400 }}>{r.score}</p>
                  <p className="text-white/35 text-[10px] font-sans font-light">{r.source}</p>
                </div>
              </div>
              <blockquote className="text-white/70 text-sm font-sans font-light leading-relaxed flex-1 italic">
                "{r.text}"
              </blockquote>
              <p className="text-white/25 text-xs font-sans font-light">{r.date}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
