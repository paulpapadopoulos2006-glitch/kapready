'use client'
import { useState, useEffect } from 'react'

export default function PricingTab() {
  const [rate, setRate]       = useState('')
  const [saved, setSaved]     = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    fetch('/api/pricing').then(r => r.json()).then(d => setRate(String(d.config?.nightly_rate ?? 90)))
  }, [])

  async function save() {
    setLoading(true); setError(''); setSaved(false)
    const res = await fetch('/api/admin/pricing', {
      method:'PATCH', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ nightly_rate: Number(rate) }),
    })
    setLoading(false)
    if (res.ok) setSaved(true)
    else setError('Failed to save. Try again.')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-gold text-2xl font-bold mb-1">Nightly Rate</h2>
        <p className="text-white/40 text-sm">Changes take effect immediately across the booking site.</p>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <label className="block text-xs uppercase tracking-widest text-white/50 mb-3">Rate per night (€ EUR)</label>
        <div className="flex items-center gap-3">
          <span className="text-3xl text-white/30 font-serif">€</span>
          <input type="number" value={rate} onChange={e => setRate(e.target.value)} min="1" max="9999" step="1"
            className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-3xl font-serif w-36 text-center focus:outline-none focus:border-gold" />
          <span className="text-white/30 text-sm">/ night</span>
        </div>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        {saved && <p className="text-green-400 text-sm mt-3">✓ Rate updated to €{rate}/night</p>}
        <button onClick={save} disabled={loading || !rate}
          className="mt-5 bg-gold hover:bg-gold-700 disabled:bg-white/10 text-navy disabled:text-white/30 px-8 py-3 rounded-xl font-bold transition-colors">
          {loading ? 'Saving...' : '💾 Save Rate'}
        </button>
      </div>
      <div className="bg-white/3 border border-white/8 rounded-xl p-4 text-sm text-white/40">
        <p>💡 <strong className="text-white/60">Tip:</strong> Old reservations keep their original rate — your pricing snapshot is locked at booking time. Only new bookings get the updated rate.</p>
      </div>
    </div>
  )
}
