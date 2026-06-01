import { NextResponse }      from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase.from('pricing_config').select('key, value')
    const config = Object.fromEntries((data ?? []).map((r: {key:string;value:number}) => [r.key, Number(r.value)]))
    return NextResponse.json({ config })
  } catch {
    return NextResponse.json({ config: { nightly_rate: 90, max_guests: 3 } })
  }
}
