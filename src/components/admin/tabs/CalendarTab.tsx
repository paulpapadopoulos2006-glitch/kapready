'use client'
import { useState, useEffect } from 'react'
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns'
import type { BlockedRange } from '@/types'
import { buildBlockedSet }   from '@/lib/availability'

const LEGEND: [string, string][] = [
  ['#FF5A5F', 'Airbnb'],
  ['#3B82F6', 'Booking.com'],
  ['#22C55E', 'Direct booking'],
  ['#9CA3AF', 'Owner block'],
]

export default function CalendarTab() {
  const [month,   setMonth]   = useState(new Date())
  const [blocked, setBlocked] = useState<BlockedRange[]>([])
  const [adding,  setAdding]  = useState('')
  const [note,    setNote]    = useState('')

  async function load() {
    const res = await fetch('/api/availability')
    const d   = await res.json()
    setBlocked(d.ranges ?? [])
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load() }, [])

  const blockedSet = buildBlockedSet(blocked)
  const days       = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) })
  const startPad   = getDay(days[0]) === 0 ? 6 : getDay(days[0]) - 1

  const dayColor = (key: string): string => {
    const src = blocked.find(r => {
      const s = new Date(r.check_in)
      const e = new Date(r.check_out)
      return new Date(key) >= s && new Date(key) < e
    })?.source
    if (src === 'airbnb')      return 'bg-[#FF5A5F]/25 text-[#FF5A5F]'
    if (src === 'booking_com') return 'bg-blue-700/30 text-blue-300'
    if (src === 'direct')      return 'bg-green-700/30 text-green-300'
    return 'bg-white/20 text-white/70'
  }

  async function blockDate() {
    if (!adding) return
    await fetch('/api/admin/blocked-dates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: adding, notes: note }),
    })
    setAdding(''); setNote(''); load()
  }

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-gold text-2xl font-bold">Availability Calendar</h2>

      <div className="flex flex-wrap gap-3 text-xs">
        {LEGEND.map(([color, label]) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => setMonth(m => addDays(startOfMonth(m), -1))} className="text-white/40 hover:text-white text-xl px-2">‹</button>
        <span className="font-serif text-white text-lg font-semibold min-w-[160px] text-center">{format(month, 'MMMM yyyy')}</span>
        <button onClick={() => setMonth(m => addDays(endOfMonth(m), 1))} className="text-white/40 hover:text-white text-xl px-2">›</button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => (
          <div key={d} className="text-white/30 text-xs py-1">{d}</div>
        ))}
        {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} />)}
        {days.map(day => {
          const key = format(day, 'yyyy-MM-dd')
          return (
            <div key={key} className={`rounded-lg py-2 text-xs font-medium ${blockedSet.has(key) ? dayColor(key) : 'bg-white/5 text-white/40'}`}>
              {format(day, 'd')}
            </div>
          )
        })}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <p className="font-semibold text-white text-sm mb-3">Block a Date Manually</p>
        <div className="flex gap-2">
          <input type="date" value={adding} onChange={e => setAdding(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-gold" />
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="Reason (optional)"
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm placeholder-white/25 focus:outline-none focus:border-gold" />
          <button onClick={blockDate} className="bg-gold text-navy px-4 py-2 rounded-xl font-bold text-sm">Block</button>
        </div>
      </div>
    </div>
  )
}
