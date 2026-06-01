'use client'
import { useState, useEffect, useCallback } from 'react'
import type { ICalSource } from '@/types'

const PRESETS = [
  { name:'airbnb',      label:'Airbnb',       color:'#FF5A5F', hint:'Airbnb → Listing → Availability → Export Calendar → Copy link' },
  { name:'booking_com', label:'Booking.com',  color:'#003580', hint:'Booking.com Extranet → Calendar → Export → iCal URL' },
]

export default function ICalTab() {
  const [sources,  setSources]  = useState<ICalSource[]>([])
  const [urls,     setUrls]     = useState<Record<string,string>>({})
  const [syncing,  setSyncing]  = useState<Record<string,boolean>>({})
  const [messages, setMessages] = useState<Record<string,string>>({})

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/ical/sources')
    const d   = await res.json()
    setSources(d.sources ?? [])
    const u: Record<string,string> = {}
    d.sources?.forEach((s: ICalSource) => { u[s.name] = s.feed_url })
    setUrls(u)
  }, [])

  useEffect(() => { load() }, [load])

  async function saveUrl(name: string) {
    const url = urls[name]; if (!url) return
    await fetch('/api/admin/ical/sources', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ name, feed_url:url }) })
    setMessages(m => ({ ...m, [name]:'✓ URL saved' }))
    setTimeout(() => setMessages(m => ({ ...m, [name]:'' })), 2500)
    load()
  }

  async function syncSource(sourceId: string, name: string) {
    setSyncing(s => ({ ...s, [name]:true }))
    const res = await fetch('/api/admin/ical/sync', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ sourceId }) })
    const d   = await res.json()
    setSyncing(s => ({ ...s, [name]:false }))
    setMessages(m => ({ ...m, [name]: d.success ? `✓ Synced — ${d.blockedCount} dates imported` : `✗ Error: ${d.error}` }))
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-gold text-2xl font-bold mb-1">iCal Sync</h2>
          <p className="text-white/40 text-sm">Paste your OTA iCal feed URL to automatically block those dates here.</p>
        </div>
        <button onClick={() => fetch('/api/admin/ical/sync',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'}).then(load)}
          className="text-xs bg-gold text-navy px-4 py-2 rounded-lg font-bold hover:bg-gold-300 transition-colors">↻ Sync All</button>
      </div>
      {PRESETS.map(p => {
        const source    = sources.find(s => s.name === p.name)
        const isSyncing = syncing[p.name]
        return (
          <div key={p.name} className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background:p.color }} />
              <span className="font-semibold text-white">{p.label}</span>
              {source?.last_synced && <span className="ml-auto text-white/30 text-xs">Last synced: {new Date(source.last_synced).toLocaleString()}</span>}
            </div>
            <p className="text-white/30 text-xs mb-3 italic">📍 {p.hint}</p>
            <div className="flex gap-2">
              <input value={urls[p.name] || ''} onChange={e => setUrls(u => ({ ...u, [p.name]:e.target.value }))}
                placeholder={`https://www.${p.name === 'airbnb' ? 'airbnb.com' : 'booking.com'}/calendar/ical/...`}
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white text-xs placeholder-white/25 focus:outline-none focus:border-gold min-w-0" />
              <button onClick={() => saveUrl(p.name)} className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl text-xs text-white/70 transition-colors whitespace-nowrap">Save URL</button>
              {source && (
                <button onClick={() => syncSource(source.id, p.name)} disabled={isSyncing}
                  className="bg-gold text-navy px-3 py-2 rounded-xl text-xs font-bold disabled:opacity-50 whitespace-nowrap">
                  {isSyncing ? '...' : '↻ Sync'}
                </button>
              )}
            </div>
            {messages[p.name] && <p className={`text-xs mt-2 ${messages[p.name].startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>{messages[p.name]}</p>}
            {source?.last_error && !messages[p.name] && <p className="text-red-400 text-xs mt-2">Last error: {source.last_error}</p>}
          </div>
        )
      })}
    </div>
  )
}
