import { NextRequest, NextResponse }     from 'next/server'
import { isAdmin }                       from '@/lib/admin-auth'
import { syncICalSource, syncAllActive } from '@/lib/ical'
import { createAdminClient }             from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  if (body.sourceId) {
    const supabase = createAdminClient()
    const { data: source } = await supabase
      .from('ical_sources').select('*').eq('id', body.sourceId).single()
    if (!source) return NextResponse.json({ error: 'Source not found' }, { status: 404 })
    return NextResponse.json(await syncICalSource(source.id, source.feed_url, source.name))
  }
  return NextResponse.json(await syncAllActive())
}
