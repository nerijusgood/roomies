/** ISO week helpers. Week ids look like "2026-W41". Uses the device's local time. */

export function isoWeekOf(date: Date): { year: number; week: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return { year: d.getUTCFullYear(), week }
}

export function weekId(date: Date): string {
  const { year, week } = isoWeekOf(date)
  return `${year}-W${String(week).padStart(2, '0')}`
}

export function parseWeekId(id: string): { year: number; week: number } {
  const m = /^(\d{4})-W(\d{2})$/.exec(id)
  if (!m) throw new Error(`Bad week id: ${id}`)
  return { year: Number(m[1]), week: Number(m[2]) }
}

export function isValidWeekId(id: unknown): id is string {
  return typeof id === 'string' && /^\d{4}-W\d{2}$/.test(id)
}

/** Monday 00:00 local time of the given ISO week. */
export function mondayOf(id: string): Date {
  const { year, week } = parseWeekId(id)
  const jan4 = new Date(year, 0, 4)
  const jan4Day = jan4.getDay() || 7
  const monday = new Date(year, 0, 4 - jan4Day + 1)
  monday.setDate(monday.getDate() + (week - 1) * 7)
  return monday
}

export function addWeeks(id: string, n: number): string {
  const m = mondayOf(id)
  m.setDate(m.getDate() + n * 7)
  return weekId(m)
}

/** Whole weeks from a to b (b - a). */
export function weeksBetween(a: string, b: string): number {
  const ms = mondayOf(b).getTime() - mondayOf(a).getTime()
  return Math.round(ms / (7 * 86400000))
}

export function weekNumber(id: string): number {
  return parseWeekId(id).week
}
