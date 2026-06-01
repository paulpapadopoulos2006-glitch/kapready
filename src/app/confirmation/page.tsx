import { Suspense } from 'react'
import Link         from 'next/link'
import { stripe }   from '@/lib/stripe'
import { PROPERTY } from '@/constants/property'

async function Content({ sessionId }: { sessionId: string }) {
  let guestName = 'Guest', checkIn = '', checkOut = ''
  try {
    const s = await stripe.checkout.sessions.retrieve(sessionId)
    guestName = s.metadata?.guest_name || 'Guest'
    checkIn   = s.metadata?.check_in   || ''
    checkOut  = s.metadata?.check_out  || ''
  } catch {}

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="font-serif text-3xl font-bold text-navy mb-3">You're booked, {guestName}!</h1>
        <p className="text-stone-500 mb-6 leading-relaxed">Your stay at KAP Home Chios is confirmed. A confirmation email is on its way.</p>
        {checkIn && checkOut && (
          <div className="bg-cream-100 rounded-2xl p-5 mb-6 grid grid-cols-2 gap-3">
            <div><p className="text-xs text-stone-400 uppercase tracking-wider mb-1">Check-in</p><p className="font-semibold text-navy">{checkIn}</p></div>
            <div><p className="text-xs text-stone-400 uppercase tracking-wider mb-1">Check-out</p><p className="font-semibold text-navy">{checkOut}</p></div>
          </div>
        )}
        <a href={PROPERTY.host.whatsapp} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-semibold mb-3">
          💬 Message Pavlos on WhatsApp
        </a>
        <Link href="/" className="text-stone-400 text-sm hover:text-navy transition-colors">← Back to KAP Home</Link>
      </div>
    </div>
  )
}

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id: sid } = await searchParams
  if (!sid) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-serif text-3xl text-navy mb-4">Booking Complete</h1>
        <Link href="/" className="text-gold underline">← Return home</Link>
      </div>
    </div>
  )
  return <Suspense fallback={<div className="min-h-screen bg-cream animate-pulse" />}><Content sessionId={sid} /></Suspense>
}
