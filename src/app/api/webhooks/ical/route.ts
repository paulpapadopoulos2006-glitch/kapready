import { NextRequest, NextResponse } from 'next/server'
import { syncAllActive }             from '@/lib/ical'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-sync-secret')
  if (secret !== process.env.ADMIN_SESSION_SECRET)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const result = await syncAllActive()
  return NextResponse.json(result)
}
