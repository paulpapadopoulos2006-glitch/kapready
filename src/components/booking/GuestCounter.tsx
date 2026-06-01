interface Props { value: number; onChange: (v: number) => void; max: number }
export default function GuestCounter({ value, onChange, max }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-semibold text-navy text-sm">Guests</p>
        <p className="text-stone-400 text-xs">Max {max} guests</p>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => onChange(Math.max(1, value - 1))} disabled={value <= 1}
          className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-navy font-bold disabled:opacity-30 hover:border-gold hover:text-gold transition-colors">−</button>
        <span className="font-semibold text-navy w-4 text-center">{value}</span>
        <button onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}
          className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-navy font-bold disabled:opacity-30 hover:border-gold hover:text-gold transition-colors">+</button>
      </div>
    </div>
  )
}
