import { eachDayOfInterval, parseISO, format, isBefore, startOfDay } from 'date-fns'
import type { BlockedRange } from '@/types'

export function buildBlockedSet(ranges: BlockedRange[]): Set<string> {
  const set = new Set<string>()
  for (const range of ranges) {
    const start      = parseISO(range.check_in)
    const lastBlocked = new Date(parseISO(range.check_out).getTime() - 86_400_000)
    if (isBefore(lastBlocked, start)) continue
    eachDayOfInterval({ start, end: lastBlocked }).forEach(d => set.add(format(d, 'yyyy-MM-dd')))
  }
  return set
}

export function isRangeAvailable(checkIn: Date, checkOut: Date, blocked: Set<string>): boolean {
  const start     = startOfDay(checkIn)
  const lastNight = new Date(startOfDay(checkOut).getTime() - 86_400_000)
  if (isBefore(lastNight, start)) return false
  return !eachDayOfInterval({ start, end: lastNight }).some(d => blocked.has(format(d, 'yyyy-MM-dd')))
}
