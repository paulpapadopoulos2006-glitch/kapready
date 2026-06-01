import * as ical from 'node-ical'
import { eachDayOfInterval, format, startOfDay, isBefore } from 'date-fns'
import { createAdminClient } from '@/lib/supabase/server'

export async function syncICalSource(
  sourceId:   string,
  feedUrl:    string,
  sourceName: 'airbnb' | 'booking_com',
): Promise<{ success: boolean; blockedCount?: number; error?: string }> {
  const supabase = createAdminClient()
  try {
    const events = await ical.async.fromURL(feedUrl)
    const rows: { date: string; reason: string; source_uid: string }[] = []

    for (const key in events) {
      const event = events[key]
      if (event.type !== 'VEVENT' || !event.start || !event.end) continue
      const start     = startOfDay(new Date(event.start as Date))
      const checkoutD = startOfDay(new Date(event.end   as Date))
      const lastNight = new Date(checkoutD.getTime() - 86_400_000)
      if (isBefore(lastNight, start)) continue
      eachDayOfInterval({ start, end: lastNight }).forEach(day => {
        rows.push({ date: format(day, 'yyyy-MM-dd'), reason: sourceName,
          source_uid: `${event.uid || key}-${format(day, 'yyyy-MM-dd')}` })
      })
    }

    await supabase.from('blocked_dates').delete().eq('reason', sourceName)
    if (rows.length > 0) {
      const { error } = await supabase.from('blocked_dates')
        .upsert(rows, { onConflict: 'date', ignoreDuplicates: true })
      if (error) throw new Error(error.message)
    }

    await supabase.from('ical_sources')
      .update({ last_synced: new Date().toISOString(), last_error: null })
      .eq('id', sourceId)

    return { success: true, blockedCount: rows.length }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    await supabase.from('ical_sources').update({ last_error: msg }).eq('id', sourceId)
    return { success: false, error: msg }
  }
}

export async function syncAllActive() {
  const supabase = createAdminClient()
  const { data: sources } = await supabase.from('ical_sources').select('*').eq('is_active', true)
  if (!sources?.length) return { synced: 0, results: [] }
  const results = await Promise.all(
    sources.map(s => syncICalSource(s.id, s.feed_url, s.name as 'airbnb' | 'booking_com')),
  )
  return { synced: sources.length, results }
}
