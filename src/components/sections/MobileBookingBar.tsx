'use client'
import { useState, useEffect }  from 'react'
import { useRouter }            from 'next/navigation'
import { differenceInCalendarDays, format } from 'date-fns'
import { motion, AnimatePresence }          from 'framer-motion'
import { formatEur }            from '@/lib/pricing'
import AvailabilityCalendar     from '@/components/booking/AvailabilityCalendar'
import GuestCounter             from '@/components/booking/GuestCounter'
import { PROPERTY }             from '@/constants/property'
import type { DateRange, BlockedRange } from '@/types'

export default function MobileBookingBar() {
  const router = useRouter()
  const [open,    setOpen]    = useState(false)
  const [range,   setRange]   = useState<DateRange>({ from: undefined, to: undefined })
  const [guests,  setGuests]  = useState(2)
  const [rate,    setRate]    = useState(90)
  const [blocked, setBlocked] = useState<BlockedRange[]>([])

  useEffect(() => {
    fetch('/api/pricing').then(r => r.json()).then(d => setRate(d.config?.nightly_rate ?? 90)).catch(() => {})
    fetch('/api/availability').then(r => r.json()).then(d => setBlocked(d.ranges ?? [])).catch(() => {})
  }, [])

  const nights = range.from && range.to ? differenceInCalendarDays(range.to, range.from) : 0
  const total  = nights > 0 ? nights * rate : null

  function handleReserve() {
    if (!range.from || !range.to) return
    router.push(`/booking?checkin=${format(range.from,'yyyy-MM-dd')}&checkout=${format(range.to,'yyyy-MM-dd')}&guests=${guests}`)
    setOpen(false)
  }

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 px-4 py-3 flex items-center gap-3 shadow-2xl">
        <div className="flex-1">
          <p className="font-serif font-bold text-navy text-lg">{formatEur(rate)}<span className="font-sans font-normal text-stone-400 text-sm"> / night</span></p>
          <p className="text-stone-400 text-xs">★ {PROPERTY.stats.rating} · No hidden fees</p>
        </div>
        <button onClick={() => setOpen(true)} className="bg-gold text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg">Book Now</button>
      </div>
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />
            <motion.div initial={{ y:'100%' }} animate={{ y:0 }} exit={{ y:'100%' }}
              transition={{ type:'spring', damping:30, stiffness:300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-6 lg:hidden max-h-[92vh] overflow-y-auto">
              <div className="w-12 h-1 bg-stone-300 rounded-full mx-auto mb-6" />
              <h2 className="font-serif text-2xl font-bold text-navy mb-4">Select Dates</h2>
              <AvailabilityCalendar blockedRanges={blocked} selected={range} onSelect={setRange} />
              <div className="border border-stone-200 rounded-xl p-3 my-4">
                <GuestCounter value={guests} onChange={setGuests} max={PROPERTY.stats.maxGuests} />
              </div>
              {total && (
                <div className="bg-cream-100 rounded-xl p-4 mb-4 flex justify-between font-bold text-navy">
                  <span>Total ({nights} night{nights > 1 ? 's' : ''})</span>
                  <span>{formatEur(total)}</span>
                </div>
              )}
              <button onClick={handleReserve} disabled={!range.from || !range.to}
                className="w-full bg-gold disabled:bg-stone-200 disabled:text-stone-400 text-white py-4 rounded-xl font-semibold">
                {total ? `Reserve — ${formatEur(total)}` : 'Select dates to continue'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
