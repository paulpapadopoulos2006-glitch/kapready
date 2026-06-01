import { formatEur } from '@/lib/pricing'
interface Props { nightlyRate: number; numNights: number }
export default function PriceSummary({ nightlyRate, numNights }: Props) {
  const total = nightlyRate * numNights
  return (
    <div className="bg-cream-100 rounded-2xl p-5 space-y-3">
      <h3 className="font-serif text-lg font-bold text-navy">Price Summary</h3>
      <div className="space-y-2 text-sm text-stone-600">
        <div className="flex justify-between">
          <span>{formatEur(nightlyRate)} × {numNights} night{numNights !== 1 ? 's' : ''}</span>
          <span>{formatEur(total)}</span>
        </div>
        <div className="flex justify-between text-xs text-stone-400 italic">
          <span>No cleaning fee · No service fee</span><span>✓</span>
        </div>
      </div>
      <div className="border-t border-stone-200 pt-3 flex justify-between font-bold text-navy">
        <span>Total</span>
        <span className="text-xl font-serif">{formatEur(total)}</span>
      </div>
      <p className="text-xs text-stone-400 text-center">Secure payment via Stripe</p>
    </div>
  )
}
