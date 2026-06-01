import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient }         from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

function formatDt(date: string): string {
  return date.replace(/-/g, '')
}

function escapeText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!process.env.ICAL_EXPORT_TOKEN || token !== process.env.ICAL_EXPORT_TOKEN) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const supabase = createAdminClient()
  const { data: reservations } = await supabase
    .from('reservations')
    .select('id, guest_name, check_in, check_out, num_guests, created_at')
    .in('status', ['confirmed', 'pending'])
    .in('payment_status', ['paid', 'pending'])
    .order('check_in', { ascending: true })

  const now = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z'
  const prodId = 'KapHome/BookingCalendar'
  const calName = 'Kap Home Chios — Bookings'

  const events = (reservations ?? []).map(r => [
    'BEGIN:VEVENT',
    `UID:${r.id}@kaphomechios`,
    `DTSTAMP:${now}`,
    `DTSTART;VALUE=DATE:${formatDt(r.check_in)}`,
    `DTEND;VALUE=DATE:${formatDt(r.check_out)}`,
    `SUMMARY:${escapeText(`Reserved — ${r.num_guests} guest${r.num_guests > 1 ? 's' : ''}`)}`,
    `DESCRIPTION:${escapeText(`Booking ID: ${r.id}`)}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'END:VEVENT',
  ].join('\r\n')).join('\r\n')

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${prodId}//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${calName}`,
    'X-WR-TIMEZONE:Europe/Athens',
    events,
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n')

  return new NextResponse(ics, {
    status: 200,
    headers: {
      'Content-Type':        'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="kaphome.ics"',
      'Cache-Control':       'no-store',
    },
  })
}
