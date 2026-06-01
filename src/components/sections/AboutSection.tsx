'use client'
import Image        from 'next/image'
import { motion }   from 'framer-motion'
import { PROPERTY } from '@/constants/property'

export default function AboutSection() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-[#f5efe6]">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-24 items-center">

          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8 }}
            className="relative h-[420px] lg:h-[540px] rounded-2xl overflow-hidden"
          >
            <Image
              src={PROPERTY.images.hero}
              alt="KAP Home living and dining space, Chios"
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2c2420]/20 to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <p className="text-[10px] tracking-[0.2em] uppercase font-sans font-medium text-[#c1785b] mb-4">
              The Space
            </p>
            <div className="w-10 h-px bg-[#c1785b] mb-6" />
            <h2
              className="font-serif text-[#2c2420] leading-[1.12] mb-7"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontWeight: 300 }}
            >
              A Home in the Heart<br />
              of <em className="italic" style={{ color: '#c1785b' }}>Chios Island</em>
            </h2>

            <div className="space-y-4 text-[#5c4f48] font-sans font-light leading-[1.8]" style={{ fontSize: '0.97rem' }}>
              <p>KAP Home is a bright, modern 48 m² apartment designed to offer everything you need for an independent, comfortable stay on beautiful Chios Island. The open-plan living and dining area flows naturally into a fully-equipped kitchen.</p>
              <p>Warm décor draws on the traditional colours of Greece — terracotta tones and natural whites — creating an atmosphere that feels both contemporary and authentically Aegean.</p>
              <p>Sit on the sunny balcony with a morning coffee and watch the neighbourhood come alive, or stroll to the nearest beach in under ten minutes.</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {['Chios Town Centre', 'Beach < 1 km', 'Free Parking', '★ 4.97 Rated'].map(tag => (
                <span
                  key={tag}
                  className="text-[11px] font-sans font-light tracking-wide px-4 py-1.5 rounded-full border border-[rgba(193,120,91,0.3)] text-[#5c4f48]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
