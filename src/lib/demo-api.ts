// Demo mode only (VITE_DEMO=1): a fake API that runs in the browser, so the app can be shown
// without a server. Data stays in this browser's localStorage.
import type { TickStore } from '../../server/logic'
import { handleGetWeek, handlePostTicks } from '../../server/logic'
import type { WeekTicks } from '@/shared/types'
import { assignmentsFor, deadlineOf } from '@/shared/rotation'
import { addWeeks, mondayOf, weekId } from '@/shared/week'
import { areaById, config } from './data'

const KEY = 'roomies:demo-ticks'
let memory: Record<string, WeekTicks> | null = null

function load(): Record<string, WeekTicks> {
  if (memory) return memory
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return (memory = JSON.parse(raw))
  } catch {
    /* storage blocked: keep it in memory */
  }
  return (memory = seed())
}
function save(all: Record<string, WeekTicks>) {
  memory = all
  try {
    localStorage.setItem(KEY, JSON.stringify(all))
  } catch {
    /* ignore */
  }
}

/** Demo progress: this week and the two before it. */
function seed(): Record<string, WeekTicks> {
  const now = new Date()
  const current = weekId(now)
  const plan: [string, number[]][] = [
    [current, [0.4, 1, 0.5, 0]],
    [addWeeks(current, -1), [1, 1, 0.6, 1]],
    [addWeeks(current, -2), [1, 0.7, 1, 1]],
  ]
  const all: Record<string, WeekTicks> = {}
  for (const [week, shares] of plan) {
    if (week < config.startWeek) continue
    const assign = assignmentsFor(config, week)
    const ticks: WeekTicks = {}
    config.people.forEach((p, i) => {
      const items = areaById(assign[p.id])?.checklist ?? []
      const count = Math.round(items.length * shares[i % shares.length])
      const start =
        week === current
          ? Math.min(now.getTime() - 3 * 3600_000, mondayOf(week).getTime() + 2 * 86400000 + 10 * 3600_000)
          : deadlineOf(config, week).getTime() - 30 * 3600_000
      ticks[p.id] = Object.fromEntries(items.slice(0, count).map((it, k) => [it.id, { done: true, at: start + k * 9 * 60_000 }]))
    })
    all[week] = ticks
  }
  save(all)
  return all
}

const store: TickStore = {
  async getWeek(week) {
    return load()[week] ?? {}
  },
  async saveWeek(week, ticks) {
    save({ ...load(), [week]: ticks })
  },
}

const wait = () => new Promise((r) => setTimeout(r, 120))

export async function demoFetch(url: string, init?: RequestInit): Promise<Response> {
  await wait()
  const u = new URL(url, 'http://demo')
  const r =
    u.pathname === '/api/week'
      ? await handleGetWeek(store, u.searchParams.get('w'))
      : u.pathname === '/api/tick'
        ? await handlePostTicks(store, config, JSON.parse(String(init?.body ?? 'null')))
        : { status: 404, body: { error: 'Not found' } }
  return new Response(JSON.stringify(r.body), { status: r.status, headers: { 'content-type': 'application/json' } })
}

export function resetDemo() {
  memory = null
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
