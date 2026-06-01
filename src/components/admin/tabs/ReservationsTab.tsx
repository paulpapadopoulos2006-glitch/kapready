'use client'
import { useState, useEffect } from 'react'
import { formatEur }           from '@/lib/pricing'
import type { ReservationRow } from '@/types'

const STATUS_COLORS: Record<string,string> = {
  confirmed: 'bg-green-900/40 text-green-300',
  pending:   'bg-yellow-900/40 text-yellow-300',
  cancelled: 'bg-red-900/40 text-red-300',
  completed: 'bg-blue-900/40 text-blue-300',
}

export default function ReservationsTab() {
  const [rows,     setRows]     = useState<ReservationRow[]>([])
  const [loading,  setLoading]  = useState(true)
  const [expanded, setExpanded] = useState<string|null>(null)

  useEffect(() => {
    fetch('/api/admin/reservations').then(r => r.json())
      .then(d => { setRows(d.reservations ?? []); setLoading(false) })
  }, [])

  if (loading) return <div className="text-white/40 text-sm py-10 text-center">Loading reservations...</div>
  if (!rows.length) return <div className="text-white/40 text-sm py-10 text-center">No reservations yet.</div>

  return (
    <div className="space-y-4">
      <div className="flex items-baseline gap-3">
        <h2 className="font-serif text-gold text-2xl font-bold">Reservations</h2>
        <span className="text-white/40 text-sm">{rows.length} total</span>
      </div>
      {rows.map(r => (
        <div key={r.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <button className="w-full text-left p-4 flex items-center gap-3"
            onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-white">{r.guest_name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[r.status] ?? ''}`}>{r.status}</span>
                <span className="text-xs text-white/30 uppercase">{r.booking_source}</span>
              </div>
              <p className="text-white/50 text-xs mt-1">{r.check_in} → {r.check_out} · {r.num_nights} night{r.num_nights !== 1 ? 's' : ''} · {r.num_guests} guest{r.num_guests !== 1 ? 's' : ''}</p>
            </div>
            <span className="font-serif text-gold font-bold">{formatEur(r.total_amount)}</span>
          </button>
          {expanded === r.id && (
            <div className="px-4 pb-4 border-t border-white/10 grid grid-cols-2 gap-3 text-xs text-white/50 pt-3">
              <div><span className="text-white/30">Email</span><br />{r.guest_email}</div>
              <div><span className="text-white/30">Phone</span><br />{r.guest_phone || '—'}</div>
              <div><span className="text-white/30">Rate</span><br />€{r.nightly_rate}/night</div>
              <div><span className="text-white/30">Payment</span><br />{r.payment_status}</div>
              <div className="col-span-2"><span className="text-white/30">Requests</span><br />{r.special_requests || '—'}</div>
              <div className="col-span-2"><span className="text-white/30">Booked</span><br />{new Date(r.created_at).toLocaleString()}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
