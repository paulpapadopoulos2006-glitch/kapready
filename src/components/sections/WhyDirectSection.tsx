'use client'
import Link       from 'next/link'
import { motion } from 'framer-motion'

const reasons = [
  { icon:'💸', title:'No 12–15% Service Fee',    desc:'Airbnb and Booking.com add up to 15% on top. Book here and that money stays in your pocket.' },
  { icon:'💬', title:'Direct Host Communication', desc:'Chat directly with Pavlos via WhatsApp — flexible check-in, local tips, any question answered instantly.' },
  { icon:'✅', title:'Best Price Guaranteed',     desc:'€90/night is our direct rate. You will never find it cheaper anywhere else, guaranteed.' },
]

export default function WhyDirectSection() {
  return (
    <section className="py-24 lg:py-32 bg-[#f5efe6]">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[10px] tracking-[0.2em] uppercase font-sans font-medium text-[#c1785b] mb-4">
            Why book direct?
          </p>
          <div className="w-10 h-px bg-[#c1785b] mx-auto mb-6" />
          <h2
            className="font-serif text-[#2c2420]"
            style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 300 }}
          >
            Book Direct.<br />
            <em className="italic" style={{ color: '#c1785b' }}>Pay Less. Stay Better.</em>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {reasons.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#fdfaf6] rounded-2xl p-7 border border-[rgba(193,120,91,0.12)]"
            >
              <span className="text-3xl block mb-5">{r.icon}</span>
              <h3 className="font-serif text-[#2c2420] mb-3" style={{ fontSize: '1.2rem', fontWeight: 400 }}>
                {r.title}
              </h3>
              <p className="text-[#5c4f48] text-sm font-sans font-light leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-sm font-sans font-medium tracking-wide text-white transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: '#c1785b' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#a05e44')}
            onMouseLeave={e => (e.currentTarget.style.background = '#c1785b')}
          >
            Check Availability →
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
