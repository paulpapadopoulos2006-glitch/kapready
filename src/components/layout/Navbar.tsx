'use client'
import { useEffect, useState } from 'react'
import Link                    from 'next/link'
import { motion }              from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? 'bg-[rgba(253,250,246,0.92)] backdrop-blur-md shadow-sm border-b border-[rgba(193,120,91,0.15)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16 md:h-20">

          <Link href="/" className="flex flex-col leading-tight">
            <span className={`font-serif text-xl tracking-[0.12em] transition-colors font-light ${
              scrolled ? 'text-[#2c2420]' : 'text-white'
            }`}>
              K A P
            </span>
            <span className={`text-[9px] tracking-[0.28em] uppercase font-sans font-light transition-colors ${
              scrolled ? 'text-[#8c7e78]' : 'text-white/60'
            }`}>
              Home · Chios
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <nav className={`hidden md:flex items-center gap-8 text-[11px] tracking-[0.1em] uppercase font-sans font-medium transition-colors ${
              scrolled ? 'text-[#5c4f48]' : 'text-white/80'
            }`}>
              {[['/#about','About'],['/#amenities','Amenities'],['/#location','Location'],['/#reviews','Reviews']].map(([href,label]) => (
                <Link key={href} href={href} className="hover:text-[#c1785b] transition-colors">
                  {label}
                </Link>
              ))}
            </nav>

            <Link
              href="/booking"
              className={`inline-flex items-center px-5 py-2 rounded-full text-xs font-sans font-medium tracking-wide transition-all duration-200 hover:-translate-y-px ${
                scrolled
                  ? 'bg-[#c1785b] text-white hover:bg-[#a05e44]'
                  : 'bg-white/15 text-white border border-white/30 backdrop-blur-sm hover:bg-white/25'
              }`}
            >
              Book Direct — Save 12%
            </Link>
          </div>

        </div>
      </div>
    </motion.nav>
  )
}
