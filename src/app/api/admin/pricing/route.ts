import { NextRequest, NextResponse } from 'next/server'
import { isAdmin }                   from '@/lib/admin-auth'
import { createAdminClient }         from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { nightly_rate } = await req.json()
  const rate = Number(nightly_rate)
  if (isNaN(rate) || rate < 1 || rate > 9999)
    return NextResponse.json({ error: 'Invalid rate' }, { status: 400 })
  const supabase = createAdminClient()
  await supabase.from('pricing_config')
    .update({ value: rate, updated_at: new Date().toISOString() })
    .eq('key', 'nightly_rate')
  return NextResponse.json({ ok: true, nightly_rate: rate })
}
