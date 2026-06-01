'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState, useEffect } from 'react'
import { differenceInCalendarDays, format, parseISO } from 'date-fns'
import Image        from 'next/image'
import Link         from 'next/link'
import { PROPERTY } from '@/constants/property'
import { formatEur } from '@/lib/pricing'
import PriceSummary  from '@/components/booking/PriceSummary'
import BookingForm, { type BookingFormData } from '@/components/booking/BookingForm'
import AvailabilityCalendar from '@/components/booking/AvailabilityCalendar'
import GuestCounter  from '@/components/booking/GuestCounter'
import type { BlockedRange } from '@/types'

function BookingPageInner() {
  const params  = useSearchParams()
  const router  = useRouter()
  const [checkin,  setCheckin]  = useState(params.get('checkin')  || '')
  const [checkout, setCheckout] = useState(params.get('checkout') || '')
  const [guests,   setGuests]   = useState(Number(params.get('guests') || 2))
  const [rate,     setRate]     = useState(90)
  const [blocked,  setBlocked]  = useState<BlockedRange[]>([])
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [step,     setStep]     = useState<'dates'|'details'>(checkin && checkout ? 'details' : 'dates')

  const checkinDate  = checkin  ? parseISO(checkin)  : undefined
  const checkoutDate = checkout ? parseISO(checkout) : undefined
  const nights = checkinDate && checkoutDate ? differenceInCalendarDays(checkoutDate, checkinDate) : 0

  useEffect(() => {
    fetch('/api/pricing').then(r => r.json()).then(d => setRate(d.config?.nightly_rate ?? 90)).catch(() => {})
    fetch('/api/availability').then(r => r.json()).then(d => setBlocked(d.ranges ?? [])).catch(() => {})
  }, [])

  async function handleSubmit(formData: BookingFormData) {
    if (!checkin || !checkout || nights < 1) { setError('Please select valid dates.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/checkout', {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ checkIn:checkin, checkOut:checkout, numGuests:guests,
          nightlyRate:rate, total:rate*nights, guestName:formData.guestName,
          guestEmail:formData.guestEmail, guestPhone:formData.guestPhone,
          specialRequests:formData.specialRequests }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong.'); return }
      window.location.href = data.url
    } catch { setError('Network error — please try again.') }
    finally  { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-navy py-4 px-4 flex items-center gap-4">
        <Link href="/" className="text-white/60 hover:text-white text-sm">← Back</Link>
        <span className="font-serif text-white text-lg">KAP Home · Book Direct</span>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-10 grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200/60">
            <h2 className="font-serif text-2xl font-bold text-navy mb-5">
              {step === 'dates' ? '1. Select Your Dates' : `✓ ${checkinDate ? format(checkinDate,'dd MMM') : ''} → ${checkoutDate ? format(checkoutDate,'dd MMM yyyy') : ''}`}
            </h2>
            {step === 'dates' ? (
              <>
                <AvailabilityCalendar blockedRanges={blocked}
                  selected={{ from:checkinDate, to:checkoutDate }}
                  onSelect={r => { setCheckin(r.from ? format(r.from,'yyyy-MM-dd') : ''); setCheckout(r.to ? format(r.to,'yyyy-MM-dd') : '') }} />
                <div className="border border-stone-200 rounded-xl p-3 mt-4">
                  <GuestCounter value={guests} onChange={setGuests} max={PROPERTY.stats.maxGuests} />
                </div>
                <button disabled={!checkin || !checkout || nights < 1} onClick={() => setStep('details')}
                  className="mt-4 w-full bg-navy text-white py-3 rounded-xl font-semibold disabled:bg-stone-200 disabled:text-stone-400">
                  {nights > 0 ? `Continue — ${nights} night${nights>1?'s':''}` : 'Select dates to continue'}
                </button>
              </>
            ) : (
              <button onClick={() => setStep('dates')} className="text-sm text-gold underline">Change dates</button>
            )}
          </div>
          {step === 'details' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200/60">
              <h2 className="font-serif text-2xl font-bold text-navy mb-5">2. Your Details</h2>
              {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-xl">{error}</p>}
              <BookingForm onSubmit={handleSubmit} loading={loading} />
            </div>
          )}
        </div>
        <div className="lg:col-span-2">
          <div className="sticky top-6 bg-white rounded-2xl shadow-sm border border-stone-200/60 overflow-hidden">
            <div className="relative h-44">
              <Image src={PROPERTY.images.hero} alt="KAP Home" fill className="object-cover" />
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="font-serif text-lg font-bold text-navy">KAP Home · Chios</p>
                <p className="text-stone-400 text-xs">★ {PROPERTY.stats.rating} · {PROPERTY.stats.size} · {PROPERTY.stats.maxGuests} guests max</p>
              </div>
              {nights > 0 ? <PriceSummary nightlyRate={rate} numNights={nights} /> :
                <div className="bg-cream-100 rounded-xl p-4 text-center text-stone-400 text-sm">Select dates to see total</div>}
              <div className="flex items-center gap-2 text-xs text-stone-400 border-t border-stone-100 pt-3">
                <span>🔒</span><span>Secure payment via Stripe. You won't be charged yet.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream animate-pulse" />}>
      <BookingPageInner />
    </Suspense>
  )
}
