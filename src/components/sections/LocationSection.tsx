'use client'
import { motion }   from 'framer-motion'
import { PROPERTY } from '@/constants/property'

export default function LocationSection() {
  return (
    <section id="location" className="py-24 lg:py-32 bg-[#fdfaf6]">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-[10px] tracking-[0.2em] uppercase font-sans font-medium text-[#c1785b] mb-4">
            Location
          </p>
          <div className="w-10 h-px bg-[#c1785b] mx-auto mb-6" />
          <h2
            className="font-serif text-[#2c2420] mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 300 }}
          >
            Where You'll Be
          </h2>
          <p className="text-[#5c4f48] font-sans font-light leading-relaxed max-w-lg mx-auto text-sm">
            Right in the centre of Chios Town — the island's vibrant capital, where traditional architecture,
            waterfront tavernas, and the ferry port are all within walking distance.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 rounded-2xl overflow-hidden h-[380px]"
            style={{ boxShadow: '0 8px 40px rgba(44,36,32,0.1)' }}
          >
            <iframe
              src={PROPERTY.location.googleMapsEmbed}
              width="100%" height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="KAP Home location in Chios, Greece"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex flex-col gap-2.5"
          >
            <h3 className="font-serif text-[#2c2420] mb-3" style={{ fontSize: '1.2rem', fontWeight: 400 }}>
              Getting Around
            </h3>
            {PROPERTY.distances.map((d, i) => (
              <div
                key={i}
                className="flex items-center gap-3.5 p-4 rounded-xl bg-[#f5efe6] border border-transparent hover:border-[rgba(193,120,91,0.2)] transition-colors"
              >
                <span className="text-xl">{d.icon}</span>
                <div>
                  <p className="font-sans font-medium text-[#2c2420] text-sm">{d.label}</p>
                  <p className="text-[#8c7e78] text-xs font-sans font-light">{d.value} · {d.detail}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  )
}
