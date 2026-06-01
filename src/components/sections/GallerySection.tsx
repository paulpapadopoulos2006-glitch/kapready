'use client'
import { useState }  from 'react'
import Image         from 'next/image'
import { motion }    from 'framer-motion'
import Lightbox      from 'yet-another-react-lightbox'
import { PROPERTY }  from '@/constants/property'

export default function GallerySection() {
  const [open, setOpen] = useState(false)
  const [idx,  setIdx]  = useState(0)
  return (
    <section id="gallery" className="py-20 lg:py-28 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mb-12">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">Photo tour</p>
          <h2 className="font-serif text-4xl font-bold text-navy">Inside KAP Home</h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PROPERTY.gallery.map((img, i) => (
            <motion.div key={i} initial={{ opacity:0, scale:0.97 }} whileInView={{ opacity:1, scale:1 }}
              viewport={{ once:true }} transition={{ delay: i * 0.08 }}
              className={`relative overflow-hidden rounded-xl cursor-pointer group ${i === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-square'}`}
              onClick={() => { setIdx(i); setOpen(true) }}>
              <Image src={img.src} alt={img.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" sizes="(max-width:768px) 50vw, 33vw" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>
      <Lightbox open={open} close={() => setOpen(false)}
        slides={PROPERTY.gallery.map(g => ({ src: g.src, alt: g.alt }))} index={idx} />
    </section>
  )
}
