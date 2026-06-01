'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [pw,      setPw]      = useState('')
  const [err,     setErr]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setErr('')
    const res = await fetch('/api/admin/login', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ password: pw }),
    })
    setLoading(false)
    if (res.ok) router.push('/admin/dashboard')
    else { setErr('Incorrect passcode.'); setPw('') }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <div className="text-center mb-8">
          <p className="font-serif text-2xl font-bold text-navy">K A P</p>
          <p className="text-stone-400 text-xs uppercase tracking-widest mt-1">Admin Panel</p>
        </div>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)}
          placeholder="Enter passcode"
          className="w-full border border-stone-300 rounded-xl px-4 py-3 text-navy text-center text-lg tracking-widest focus:outline-none focus:border-gold mb-4"
          autoFocus />
        {err && <p className="text-red-500 text-sm text-center mb-3">{err}</p>}
        <button type="submit" disabled={loading || !pw}
          className="w-full bg-navy text-white py-3 rounded-xl font-semibold disabled:bg-stone-200 disabled:text-stone-400 transition-colors">
          {loading ? 'Checking...' : 'Enter'}
        </button>
      </form>
    </div>
  )
}
