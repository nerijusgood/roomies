import type { TickState, WeekTicks } from './types'

/** Merge b into a, newest timestamp wins per item. Returns a new object. */
export function mergeTicks(a: WeekTicks, b: WeekTicks): WeekTicks {
  const out: WeekTicks = {}
  for (const src of [a, b]) {
    for (const [person, items] of Object.entries(src)) {
      out[person] ??= {}
      for (const [item, state] of Object.entries(items)) {
        const cur = out[person][item]
        if (!cur || state.at >= cur.at) out[person][item] = { ...state }
      }
    }
  }
  return out
}

export function applyTick(ticks: WeekTicks, person: string, item: string, state: TickState): WeekTicks {
  return mergeTicks(ticks, { [person]: { [item]: state } })
}

export function doneItems(ticks: WeekTicks, person: string, itemIds: string[]): string[] {
  const mine = ticks[person] ?? {}
  return itemIds.filter((id) => mine[id]?.done)
}

/** Time the last item was ticked, if all are done. */
export function finishedAt(ticks: WeekTicks, person: string, itemIds: string[]): number | null {
  const mine = ticks[person] ?? {}
  if (itemIds.length === 0 || !itemIds.every((id) => mine[id]?.done)) return null
  return Math.max(...itemIds.map((id) => mine[id].at))
}

/** One checklist for a group who clean together: newest tick per item across all members wins. */
export function groupTicks(ticks: WeekTicks, people: string[]): Record<string, TickState> {
  const merged = mergeTicks({}, Object.fromEntries(people.map((p) => [p, ticks[p] ?? {}])))
  const out: Record<string, TickState> = {}
  for (const items of Object.values(merged)) {
    for (const [item, state] of Object.entries(items)) {
      if (!out[item] || state.at >= out[item].at) out[item] = state
    }
  }
  return out
}
