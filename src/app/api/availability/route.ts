import { NextResponse }      from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase.from('booked_ranges').select('check_in, check_out, source')
    return NextResponse.json({ ranges: data ?? [] })
  } catch {
    return NextResponse.json({ ranges: [] })
  }
}
