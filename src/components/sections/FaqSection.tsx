'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FAQS = [
  { q:'Where exactly is KAP Home located?', a:'KAP Home is in Chios Town centre — the capital of Chios Island, Greece. The beach is under 1 km away, restaurants are a 2-minute walk, and the airport is just 11 minutes by car.' },
  { q:'Is there a minimum stay requirement?', a:'No — you can book for as little as one night. There are no mandatory minimum stays.' },
  { q:'Is there parking available?', a:'Yes — KAP Home includes a free private underground parking space, which is rare for central Chios Town.' },
  { q:'How do I check in and check out?', a:'Check-in and check-out times are flexible — just contact Pavlos directly via WhatsApp and we will arrange a time that works for you.' },
  { q:'Are there any extra fees when booking direct?', a:'None. The nightly rate is the total you pay. No cleaning fee, no service fee, no hidden charges whatsoever.' },
  { q:'Is Chios worth visiting?', a:'Absolutely. Chios is one of the most authentic and underrated Greek islands — famous for its mastic villages, Byzantine monasteries, secluded beaches, and world-class seafood. It feels like the Greece of 20 years ago, without the crowds.' },
  { q:'How do I get to Chios?', a:'Chios has its own airport (CHQ) with direct flights from Athens (45 min) and Thessaloniki. There are also regular overnight ferries from Piraeus (Athens port) — a scenic 8-hour crossing.' },
  { q:'Can I cancel my booking?', a:'Contact Pavlos directly via WhatsApp (+306948078882) to discuss cancellation. Booking direct means you deal with the host — not a faceless platform.' },
]

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)
  const jsonLd = {
    '@context':'https://schema.org','@type':'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type':'Question', name:f.q, acceptedAnswer:{ '@type':'Answer', text:f.a } })),
  }
  return (
    <section id="faq" className="py-20 lg:py-28 bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mb-12">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">FAQ</p>
          <h2 className="font-serif text-4xl font-bold text-navy">Common Questions</h2>
        </motion.div>
        <div className="divide-y divide-stone-200/60">
          {FAQS.map((faq, i) => (
            <div key={i}>
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left py-5 flex items-center justify-between gap-4 group">
                <span className="font-semibold text-navy group-hover:text-gold transition-colors">{faq.q}</span>
                <span className={`text-2xl text-stone-400 transition-transform duration-200 flex-shrink-0 ${open === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.25 }} className="overflow-hidden">
                    <p className="pb-5 text-stone-500 leading-relaxed text-sm">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
