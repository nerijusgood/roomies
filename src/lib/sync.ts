import { useSyncExternalStore } from 'react'
import { get, set } from 'idb-keyval'
import type { TickChange, WeekTicks } from '@/shared/types'
import { applyTick, mergeTicks } from '@/shared/ticks'
import { getUser } from './user'
import { demoFetch } from './demo-api'

export const IS_DEMO = Boolean(import.meta.env.VITE_DEMO)
const api = (url: string, init?: RequestInit) => (IS_DEMO ? demoFetch(url, init) : fetch(url, init))

/** Offline-first tick store.
 *  - Ticks are saved on the phone first (IndexedDB), then sent to /api/tick.
 *  - Unsent ticks wait in an outbox and go out when the app opens, regains focus or comes back online.
 *  - Each person only writes their own ticks, and the newest timestamp wins, so there are no real conflicts. */

export type SyncStatus = 'idle' | 'syncing' | 'offline' | 'error'

interface QueuedChange extends TickChange {
  person: string
}

interface State {
  ready: boolean
  weeks: Record<string, WeekTicks>
  outbox: QueuedChange[]
  status: SyncStatus
  lastSynced: number | null
  error: string | null
}

let state: State = { ready: false, weeks: {}, outbox: [], status: 'idle', lastSynced: null, error: null }
const listeners = new Set<() => void>()
const watched = new Set<string>()

function setState(patch: Partial<State>) {
  state = { ...state, ...patch }
  listeners.forEach((l) => l())
}

async function persist() {
  try {
    await set('weeks', state.weeks)
    await set('outbox', state.outbox)
    await set('lastSynced', state.lastSynced)
  } catch {
    /* storage can be unavailable; app still works in memory */
  }
}

let initPromise: Promise<void> | null = null
export function initSync() {
  initPromise ??= (async () => {
    try {
      const [weeks, outbox, lastSynced] = await Promise.all([get('weeks'), get('outbox'), get('lastSynced')])
      setState({ weeks: weeks ?? {}, outbox: outbox ?? [], lastSynced: lastSynced ?? null, ready: true })
    } catch {
      setState({ ready: true })
    }
    window.addEventListener('online', () => void syncNow())
    window.addEventListener('offline', () => setState({ status: 'offline' }))
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') void syncNow()
    })
    setInterval(() => {
      if (document.visibilityState === 'visible') void syncNow()
    }, 30_000)
    void syncNow()
  })()
  return initPromise
}

/** Make sure these weeks are fetched on every sync. */
export function watchWeeks(weeks: string[]) {
  let added = false
  for (const w of weeks) {
    if (!watched.has(w)) {
      watched.add(w)
      added = true
    }
  }
  if (added && state.ready) void syncNow()
}

export function tick(week: string, item: string, done: boolean) {
  const user = getUser()
  if (!user) return
  const at = Date.now()
  const weeks = { ...state.weeks, [week]: applyTick(state.weeks[week] ?? {}, user.id, item, { done, at }) }
  // Keep only the newest change per item in the outbox.
  const outbox = state.outbox.filter((c) => !(c.week === week && c.item === item && c.person === user.id))
  outbox.push({ person: user.id, week, item, done, at })
  setState({ weeks, outbox })
  void persist()
  void syncNow()
}

let running: Promise<void> | null = null
let again = false

export function syncNow(): Promise<void> {
  if (running) {
    again = true
    return running
  }
  running = (async () => {
    do {
      again = false
      await syncOnce()
    } while (again)
  })().finally(() => {
    running = null
  })
  return running
}

async function syncOnce() {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    setState({ status: 'offline' })
    return
  }
  setState({ status: 'syncing' })
  try {
    await flushOutbox()
    const fetched: Record<string, WeekTicks> = {}
    await Promise.all(
      [...watched].map(async (w) => {
        const res = await api(`/api/week?w=${encodeURIComponent(w)}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = (await res.json()) as { ticks: WeekTicks }
        fetched[w] = data.ticks ?? {}
      }),
    )
    // Merge into the latest local state (the user may have ticked while we were fetching).
    const weeks = { ...state.weeks }
    for (const [w, t] of Object.entries(fetched)) weeks[w] = mergeTicks(weeks[w] ?? {}, t)
    setState({ weeks, status: state.error ? 'error' : 'idle', lastSynced: Date.now() })
    void persist()
  } catch {
    setState({ status: 'offline' })
  }
}

async function flushOutbox() {
  const user = getUser()
  if (!user || state.outbox.length === 0) return
  const mine = state.outbox.filter((c) => c.person === user.id)
  // Ticks left behind by a previous user on this phone can't be sent without their PIN: drop them.
  if (mine.length !== state.outbox.length) setState({ outbox: mine })
  if (mine.length === 0) return
  const res = await api('/api/tick', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ person: user.id, pin: user.pin, changes: mine.map(({ person: _p, ...c }) => c) }),
  })
  if (res.status === 401) {
    setState({ error: 'PIN not accepted. Log out and in again.' })
    return
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const sent = new Set(mine)
  setState({ outbox: state.outbox.filter((c) => !sent.has(c)), error: null })
  void persist()
}

export function resetLocalData() {
  setState({ weeks: {}, outbox: [], lastSynced: null, error: null })
  void persist()
  void syncNow()
}

export function useSync() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => state,
  )
}
