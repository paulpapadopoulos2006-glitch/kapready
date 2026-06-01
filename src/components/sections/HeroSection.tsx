'use client'
import { useState }    from 'react'
import Image           from 'next/image'
import Link            from 'next/link'
import { motion }      from 'framer-motion'
import Lightbox        from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { PROPERTY }    from '@/constants/property'

export default function HeroSection() {
  const [lightboxOpen,  setLightboxOpen]  = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const imgs   = PROPERTY.gallery
  const slides = imgs.map(i => ({ src: i.src, alt: i.alt }))

  return (
    <section className="relative h-[88vh] min-h-[580px] overflow-hidden">
      {/* Background image */}
      <Image
        src={imgs[0].src}
        alt="KAP Home, Chios Island"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <p className="text-xs tracking-[0.22em] uppercase text-white/65 mb-5 font-sans font-light">
              Chios Island, Greece
            </p>

            <h1 className="font-serif text-white leading-[1.06] mb-5"
              style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', fontWeight: 300 }}>
              A Home <em className="italic" style={{ color: '#f5d9c8' }}>above</em><br />
              the Aegean
            </h1>

            <p className="text-white/80 font-sans font-light leading-relaxed mb-8"
              style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', maxWidth: '420px' }}>
              Bright 48 m² apartment in the heart of Chios Town — beach under 1 km,
              free parking, ★ {PROPERTY.stats.rating} from {PROPERTY.stats.reviewCount} guests.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-sans font-medium tracking-wide transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: '#c1785b', color: '#fff' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#a05e44')}
                onMouseLeave={e => (e.currentTarget.style.background = '#c1785b')}
              >
                Check Availability
              </Link>
              <button
                onClick={() => { setLightboxIndex(0); setLightboxOpen(true) }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-sans font-light tracking-wide border border-white/40 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/15 hover:-translate-y-0.5"
              >
                View Gallery
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/50 text-[10px] tracking-[0.18em] uppercase font-sans">Scroll</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white/50 animate-bounce">
          <path d="M10 4v12M4 10l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>

      {/* Photos count */}
      <button
        onClick={() => setLightboxOpen(true)}
        className="absolute bottom-8 right-6 sm:right-10 flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs px-4 py-2 rounded-full font-sans tracking-wide hover:bg-white/20 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        All {imgs.length} photos
      </button>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={lightboxIndex}
      />
    </section>
  )
}
