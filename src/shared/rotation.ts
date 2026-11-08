import type { Config, SoloPhase } from './types'
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

function soloPhase(config: Config, week: string): SoloPhase | undefined {
  let found: SoloPhase | undefined
  for (const phase of [...(config.solo ?? [])].sort((a, b) => a.from.localeCompare(b.from))) {
    if (week >= phase.from && phase.order.length > 0) found = phase
  }
  return found
}

/** True when whoever is on duty cleans all areas this week. */
export function isSoloWeek(config: Config, week: string): boolean {
  return soloPhase(config, week) !== undefined
}

/** Person ids on duty this week (solo weeks only). More than one means they clean together. */
export function cleanersFor(config: Config, week: string): string[] {
  const phase = soloPhase(config, week)
  if (!phase) return []
  const override = config.overrides.find((o) => o.week === week)?.cleaner
  const turn = override ?? phase.order[mod(weeksBetween(phase.from, week), phase.order.length)]
  return Array.isArray(turn) ? turn : [turn]
}

/** personId -> area ids for a week. Solo weeks: everyone on duty gets every area, others none. */
export function areasFor(config: Config, week: string): Record<string, string[]> {
  if (isSoloWeek(config, week)) {
    const cleaners = cleanersFor(config, week)
    return Object.fromEntries(config.people.map((p) => [p.id, cleaners.includes(p.id) ? [...config.areas] : []]))
  }
  const legacy = assignmentsFor(config, week)
  return Object.fromEntries(config.people.map((p) => [p.id, legacy[p.id] ? [legacy[p.id] as string] : []]))
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

/** Day the deadline falls in. A midnight deadline (00:00) belongs to the day before. */
function deadlineDay(deadline: Date): Date {
  return new Date(deadline.getTime() - 1)
}

/** Short deadline text, e.g. "Sun 21:00" or "Sun midnight". */
export function deadlineLabel(config: Config, week: string): string {
  const d = deadlineOf(config, week)
  const day = deadlineDay(d).toLocaleDateString('en-GB', { weekday: 'short' })
  return `${day} ${timeLabel(d)}`
}

function timeLabel(d: Date): string {
  if (d.getHours() === 0 && d.getMinutes() === 0) return 'midnight'
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** Friendly countdown text. */
export function countdown(deadline: Date, now: Date): { label: string; urgent: boolean; passed: boolean } {
  const ms = deadline.getTime() - now.getTime()
  if (ms <= 0) return { label: 'Deadline passed', urgent: true, passed: true }
  const hours = ms / 3600000
  if (deadlineDay(deadline).toDateString() === now.toDateString()) {
    return { label: `Today, until ${timeLabel(deadline)}`, urgent: true, passed: false }
  }
  const days = Math.ceil(hours / 24)
  return { label: days === 1 ? '1 day left' : `${days} days left`, urgent: days <= 1, passed: false }
}
