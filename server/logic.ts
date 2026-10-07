import type { Config, TickChange, WeekTicks } from '../src/shared/types'
import { isValidWeekId } from '../src/shared/week'
import { mergeTicks } from '../src/shared/ticks'

/** Where ticks live. Local dev uses a JSON file, Vercel uses Upstash Redis. */
export interface TickStore {
  getWeek(week: string): Promise<WeekTicks>
  saveWeek(week: string, ticks: WeekTicks): Promise<void>
}

export interface ApiResult {
  status: number
  body: unknown
}

export async function handleGetWeek(store: TickStore, week: string | null): Promise<ApiResult> {
  if (!isValidWeekId(week)) return { status: 400, body: { error: 'Bad week' } }
  return { status: 200, body: { week, ticks: await store.getWeek(week), serverTime: Date.now() } }
}

export async function handlePostTicks(store: TickStore, config: Config, body: unknown): Promise<ApiResult> {
  const b = body as { person?: string; pin?: string; changes?: TickChange[] }
  const person = config.people.find((p) => p.id === b?.person)
  // Not real security, just stops accidental ticks for someone else.
  if (!person || person.pin !== String(b.pin ?? '')) return { status: 401, body: { error: 'Wrong name or PIN' } }
  if (!Array.isArray(b.changes) || b.changes.length > 500) return { status: 400, body: { error: 'Bad changes' } }

  const now = Date.now()
  const byWeek = new Map<string, WeekTicks>()
  for (const c of b.changes) {
    if (!isValidWeekId(c?.week) || typeof c.item !== 'string' || c.item.length > 120) continue
    const at = Math.min(Number(c.at) || now, now + 60_000)
    const patch = byWeek.get(c.week) ?? { [person.id]: {} }
    patch[person.id][c.item] = { done: Boolean(c.done), at }
    byWeek.set(c.week, patch)
  }
  for (const [week, patch] of byWeek) {
    const current = await store.getWeek(week)
    await store.saveWeek(week, mergeTicks(current, patch))
  }
  return { status: 200, body: { ok: true, weeks: [...byWeek.keys()] } }
}
