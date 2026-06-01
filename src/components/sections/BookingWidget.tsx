'use client'
import { useState, useEffect }  from 'react'
import { useRouter }            from 'next/navigation'
import { differenceInCalendarDays, format } from 'date-fns'
import { PROPERTY }             from '@/constants/property'
import { formatEur }            from '@/lib/pricing'
import AvailabilityCalendar     from '@/components/booking/AvailabilityCalendar'
import GuestCounter             from '@/components/booking/GuestCounter'
import type { DateRange, BlockedRange } from '@/types'

interface Props { blockedRanges: BlockedRange[] }

export default function BookingWidget({ blockedRanges }: Props) {
  const router = useRouter()
  const [range,   setRange]   = useState<DateRange>({ from: undefined, to: undefined })
  const [guests,  setGuests]  = useState(2)
  const [rate,    setRate]    = useState<number | null>(null)
  const [showCal, setShowCal] = useState(false)

  useEffect(() => {
    fetch('/api/pricing').then(r => r.json()).then(d => setRate(d.config?.nightly_rate ?? 90)).catch(() => setRate(90))
  }, [])

  const nights = range.from && range.to ? differenceInCalendarDays(range.to, range.from) : 0
  const total  = nights > 0 && rate ? nights * rate : null

  function handleReserve() {
    if (!range.from || !range.to || nights < 1) return
    const p = new URLSearchParams({ checkin: format(range.from,'yyyy-MM-dd'), checkout: format(range.to,'yyyy-MM-dd'), guests: guests.toString() })
    router.push(`/booking?${p}`)
  }

  return (
    <div className="bg-[rgba(253,250,246,0.97)] backdrop-blur-md rounded-2xl shadow-2xl border border-[rgba(193,120,91,0.15)] p-6 w-full">
      {/* Price + rating */}
      <div className="flex items-baseline justify-between mb-5">
        <div className="flex items-baseline gap-1">
          <span className="font-serif text-3xl text-[#2c2420]" style={{ fontWeight: 300 }}>
            {rate ? formatEur(rate) : '€90'}
          </span>
          <span className="text-[#8c7e78] text-sm font-sans font-light">/ night</span>
        </div>
        <span className="text-sm text-[#8c7e78] font-sans font-light">★ {PROPERTY.stats.rating}</span>
      </div>

      {/* Date picker trigger */}
      <button
        onClick={() => setShowCal(!showCal)}
        className="w-full border border-[rgba(193,120,91,0.25)] rounded-xl p-3.5 text-left mb-3 hover:border-[#c1785b] transition-colors"
      >
        <div className="grid grid-cols-2 divide-x divide-[rgba(193,120,91,0.15)]">
          <div className="pr-3">
            <p className="text-[9px] font-sans font-medium text-[#8c7e78] uppercase tracking-wider mb-1">Check-in</p>
            <p className="text-[#2c2420] text-sm font-sans font-light">
              {range.from ? format(range.from,'dd MMM yyyy') : 'Select date'}
            </p>
          </div>
          <div className="pl-3">
            <p className="text-[9px] font-sans font-medium text-[#8c7e78] uppercase tracking-wider mb-1">Check-out</p>
            <p className="text-[#2c2420] text-sm font-sans font-light">
              {range.to ? format(range.to,'dd MMM yyyy') : 'Select date'}
            </p>
          </div>
        </div>
      </button>

      {showCal && (
        <div className="mb-3 -mx-1">
          <AvailabilityCalendar
            blockedRanges={blockedRanges}
            selected={range}
            onSelect={r => { setRange(r); if (r.from && r.to) setShowCal(false) }}
          />
        </div>
      )}

      {/* Guests */}
      <div className="border border-[rgba(193,120,91,0.25)] rounded-xl p-3.5 mb-5">
        <GuestCounter value={guests} onChange={setGuests} max={PROPERTY.stats.maxGuests} />
      </div>

      {/* Price breakdown */}
      {total && nights > 0 && rate && (
        <div className="bg-cream-100 rounded-xl p-4 mb-4 space-y-2">
          <div className="flex justify-between text-sm text-[#5c4f48] font-sans font-light">
            <span>{formatEur(rate)} × {nights} night{nights > 1 ? 's' : ''}</span>
            <span>{formatEur(total)}</span>
          </div>
          <div className="border-t border-[rgba(193,120,91,0.15)] pt-2 flex justify-between text-[#2c2420] font-sans">
            <span className="font-medium text-sm">Total</span>
            <span className="font-medium text-sm">{formatEur(total)}</span>
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleReserve}
        disabled={!range.from || !range.to || nights < 1}
        className="w-full py-4 rounded-xl text-sm font-sans font-medium tracking-wide transition-all duration-200 disabled:cursor-not-allowed"
        style={{
          background: (!range.from || !range.to || nights < 1) ? '#e8ddd8' : '#c1785b',
          color: (!range.from || !range.to || nights < 1) ? '#a09590' : '#fff',
        }}
      >
        {nights > 0 ? `Reserve — ${formatEur(total!)}` : 'Check Availability'}
      </button>

      <p className="text-center text-[#8c7e78] text-[11px] font-sans font-light mt-3">
        No fees. No service charge. Best price.
      </p>
    </div>
  )
}
