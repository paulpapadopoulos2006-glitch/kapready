import { NextRequest, NextResponse }         from 'next/server'
import { createAdminClient }                 from '@/lib/supabase/server'
import { createCheckoutSession }             from '@/lib/stripe'
import { isRangeAvailable, buildBlockedSet } from '@/lib/availability'
import { parseISO }                          from 'date-fns'
import type { ReservationInsert, BlockedRange } from '@/types'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const {
      checkIn, checkOut, numGuests, nightlyRate, total,
      guestName, guestEmail, guestPhone, specialRequests,
    } = await req.json()

    const supabase = createAdminClient()

    const { data: ranges } = await supabase.from('booked_ranges').select('check_in, check_out')
    const blocked = buildBlockedSet((ranges ?? []) as BlockedRange[])
    if (!isRangeAvailable(parseISO(checkIn), parseISO(checkOut), blocked)) {
      return NextResponse.json(
        { error: 'Sorry — those dates were just taken. Please choose different dates.' },
        { status: 409 },
      )
    }

    const reservation: ReservationInsert = {
      guest_name:       guestName,
      guest_email:      guestEmail,
      guest_phone:      guestPhone || null,
      check_in:         checkIn,
      check_out:        checkOut,
      num_guests:       numGuests,
      nightly_rate:     nightlyRate,
      total_amount:     total,
      currency:         'EUR',
      status:           'pending',
      payment_status:   'pending',
      booking_source:   'direct',
      special_requests: specialRequests || null,
    }

    const { data: created, error: insertError } = await supabase
      .from('reservations').insert(reservation).select('id').single()
    if (insertError || !created) throw new Error(insertError?.message ?? 'Insert failed')

    const session = await createCheckoutSession({
      reservationId: created.id,
      nightlyRate,
      numNights:    Math.round(total / nightlyRate),
      totalAmount:  total,
      checkIn,
      checkOut,
      guestName,
      guestEmail,
    })

    await supabase.from('reservations')
      .update({ stripe_session_id: session.id })
      .eq('id', created.id)

    return NextResponse.json({ url: session.url })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
