'use client'
import { useForm }     from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z }           from 'zod'

const schema = z.object({
  guestName:       z.string().min(2, 'Please enter your full name'),
  guestEmail:      z.string().email('Please enter a valid email'),
  guestPhone:      z.string().optional(),
  specialRequests: z.string().max(500).optional(),
})
export type BookingFormData = z.infer<typeof schema>

interface Props { onSubmit: (data: BookingFormData) => void; loading: boolean }

export default function BookingForm({ onSubmit, loading }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormData>({ resolver: zodResolver(schema) })
  const field = 'w-full border border-stone-300 rounded-xl px-4 py-3 text-navy placeholder-stone-300 focus:outline-none focus:border-gold text-sm'
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-navy uppercase tracking-wider block mb-1.5">Full Name *</label>
        <input {...register('guestName')} placeholder="As on your passport" className={field} />
        {errors.guestName && <p className="text-red-500 text-xs mt-1">{errors.guestName.message}</p>}
      </div>
      <div>
        <label className="text-xs font-semibold text-navy uppercase tracking-wider block mb-1.5">Email Address *</label>
        <input {...register('guestEmail')} type="email" placeholder="your@email.com" className={field} />
        {errors.guestEmail && <p className="text-red-500 text-xs mt-1">{errors.guestEmail.message}</p>}
      </div>
      <div>
        <label className="text-xs font-semibold text-navy uppercase tracking-wider block mb-1.5">Phone / WhatsApp</label>
        <input {...register('guestPhone')} type="tel" placeholder="+30 or international number" className={field} />
      </div>
      <div>
        <label className="text-xs font-semibold text-navy uppercase tracking-wider block mb-1.5">Special Requests</label>
        <textarea {...register('specialRequests')} placeholder="Early check-in, late checkout, anything..." rows={3} className={`${field} resize-none`} />
      </div>
      <button type="submit" disabled={loading}
        className="w-full bg-navy hover:bg-navy-700 disabled:bg-stone-300 text-white py-4 rounded-xl font-semibold transition-colors">
        {loading ? 'Processing...' : 'Proceed to Secure Payment →'}
      </button>
    </form>
  )
}
