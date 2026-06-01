'use client'
import { useState }    from 'react'
import { useRouter }   from 'next/navigation'
import PricingTab      from './tabs/PricingTab'
import ICalTab         from './tabs/ICalTab'
import CalendarTab     from './tabs/CalendarTab'
import ReservationsTab from './tabs/ReservationsTab'

const TABS = ['Pricing','iCal Sync','Calendar','Reservations'] as const
type Tab = typeof TABS[number]

export default function AdminShell() {
  const [active, setActive] = useState<Tab>('Pricing')
  const router = useRouter()
  async function logout() {
    await fetch('/api/admin/logout', { method:'POST' })
    router.push('/admin')
  }
  return (
    <div className="min-h-screen bg-[#050f1e] text-white">
      <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="font-serif text-gold text-xl font-bold">K A P · Admin</p>
          <p className="text-white/40 text-xs mt-0.5">kaphomechios.com</p>
        </div>
        <button onClick={logout} className="text-xs text-white/40 hover:text-white border border-white/20 px-3 py-1.5 rounded-lg transition-colors">Logout</button>
      </div>
      <div className="border-b border-white/10 px-6 flex gap-1 overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActive(tab)}
            className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${active === tab ? 'border-gold text-gold' : 'border-transparent text-white/40 hover:text-white'}`}>
            {tab}
          </button>
        ))}
      </div>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {active === 'Pricing'      && <PricingTab />}
        {active === 'iCal Sync'    && <ICalTab />}
        {active === 'Calendar'     && <CalendarTab />}
        {active === 'Reservations' && <ReservationsTab />}
      </div>
    </div>
  )
}
