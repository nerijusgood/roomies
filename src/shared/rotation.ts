import type { Config } from './types'
import { mondayOf, weeksBetween } from './week'

function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

/** personId -> areaId | null for a week. Rotation moves everyone one area forward each week. */
export function assignmentsFor(config: Config, week: string): Record<string, string | null> {
  const offset = weeksBetween(config.startWeek, week)
  const n = config.areas.length
  const result: Record<string, string | null> = {}
  config.people.forEach((p, i) => {
    const start = p.startArea ? config.areas.indexOf(p.startArea) : -1
    const slot = mod((start >= 0 ? start : i) + offset, Math.max(n, config.people.length))
    result[p.id] = slot < n ? config.areas[slot] : null
  })
  for (const o of config.overrides.filter((x) => x.week === week)) {
    if (o.swap) {
      const [a, b] = o.swap
      ;[result[a], result[b]] = [result[b] ?? null, result[a] ?? null]
    }
    if (o.assign) Object.assign(result, o.assign)
  }
  return result
}

export function areaFor(config: Config, week: string, personId: string): string | null {
  return assignmentsFor(config, week)[personId] ?? null
}

export function overrideNote(config: Config, week: string): string | undefined {
  return config.overrides.find((o) => o.week === week)?.note
}

/** Deadline of a week, e.g. Sunday 21:00 local time. */
export function deadlineOf(config: Config, week: string): Date {
  const d = mondayOf(week)
  d.setDate(d.getDate() + (config.deadline.weekday - 1))
  const [h, m] = config.deadline.time.split(':').map(Number)
  d.setHours(h, m, 0, 0)
  return d
}

export type Status = 'done' | 'started' | 'todo' | 'missed' | 'free'

/** True for weeks before the rota started (no status to show). */
export function beforeStart(config: Config, week: string): boolean {
  return week < config.startWeek
}

export function statusOf(doneCount: number, total: number, deadlinePassed: boolean): Status {
  if (total === 0) return 'free'
  if (doneCount >= total) return 'done'
  if (deadlinePassed) return 'missed'
  return doneCount > 0 ? 'started' : 'todo'
}

/** Friendly countdown text. */
export function countdown(deadline: Date, now: Date): { label: string; urgent: boolean; passed: boolean } {
  const ms = deadline.getTime() - now.getTime()
  if (ms <= 0) return { label: 'Deadline passed', urgent: true, passed: true }
  const hours = ms / 3600000
  const sameDay = deadline.toDateString() === now.toDateString()
  if (sameDay) {
    const hh = String(deadline.getHours()).padStart(2, '0')
    const mm = String(deadline.getMinutes()).padStart(2, '0')
    return { label: `Today, until ${hh}:${mm}`, urgent: true, passed: false }
  }
  const days = Math.ceil(hours / 24)
  return { label: days === 1 ? '1 day left' : `${days} days left`, urgent: days <= 1, passed: false }
}
