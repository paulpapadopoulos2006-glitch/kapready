import Link         from 'next/link'
import { PROPERTY } from '@/constants/property'

export default function Footer() {
  return (
    <footer className="bg-[#1a100c] text-white/50 py-14">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16">

        <div className="grid sm:grid-cols-3 gap-10 mb-10">
          <div>
            <p className="font-serif text-white text-xl tracking-[0.1em] mb-1" style={{ fontWeight: 300 }}>
              K A P
            </p>
            <p className="text-[9px] text-white/30 uppercase tracking-[0.25em] font-sans font-light mb-5">
              Home · Chios, Greece
            </p>
            <p className="text-sm font-sans font-light leading-relaxed">{PROPERTY.location.address}</p>
          </div>

          <div>
            <p className="text-white font-sans font-medium text-xs uppercase tracking-[0.12em] mb-4">Contact</p>
            <div className="space-y-2.5 text-sm font-sans font-light">
              <a
                href={PROPERTY.host.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#c1785b] transition-colors"
              >
                💬 WhatsApp {PROPERTY.host.phone}
              </a>
              <p>Host: {PROPERTY.host.name}</p>
            </div>
          </div>

          <div>
            <p className="text-white font-sans font-medium text-xs uppercase tracking-[0.12em] mb-4">Navigation</p>
            <div className="space-y-2 text-sm font-sans font-light">
              {[['/#about','About'],['/#amenities','Amenities'],['/#location','Location'],['/#reviews','Reviews'],['/booking','Book Now']].map(([href,label]) => (
                <Link key={href} href={href} className="block hover:text-[#c1785b] transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 pt-7 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-sans font-light">
          <p>© {new Date().getFullYear()} KAP Home Chios. All rights reserved.</p>
          <p className="text-white/30">Booking direct is always cheaper than Airbnb or Booking.com.</p>
        </div>

      </div>
    </footer>
  )
}
