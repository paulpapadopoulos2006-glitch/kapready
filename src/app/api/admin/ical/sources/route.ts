import { NextRequest, NextResponse } from 'next/server'
import { isAdmin }                   from '@/lib/admin-auth'
import { createAdminClient }         from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('ical_sources').select('*').order('created_at')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ sources: data })
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name, feed_url } = await req.json()
  if (!name || !feed_url) return NextResponse.json({ error: 'name and feed_url required' }, { status: 400 })
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('ical_sources')
    .upsert({ name, feed_url, is_active: true }, { onConflict: 'name' })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ source: data }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  await createAdminClient().from('ical_sources').delete().eq('id', id)
  return NextResponse.json({ ok: true })
}
