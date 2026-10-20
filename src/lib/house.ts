import { useEffect, useMemo, useState } from 'react'
import type { Area, Person } from '@/shared/types'
import { areasFor, cleanerFor, deadlineOf, isSoloWeek, statusOf, type Status } from '@/shared/rotation'
import { doneItems, finishedAt } from '@/shared/ticks'
import { weekId } from '@/shared/week'
import { areaById, config, personById } from './data'
import { useSync, watchWeeks } from './sync'

export interface Section {
  area: Area
  items: { key: string; text: string }[]
}

export interface PersonWeek {
  person: Person
  /** First area (used for colour and doodle). In a solo week this person has ALL areas, see `sections`. */
  area: Area | undefined
  sections: Section[]
  /** True when this person cleans every area this week. */
  allAreas: boolean
  /** Solo weeks: who is on duty this week (same for every row). */
  cleaner: Person | undefined
  done: number
  total: number
  percent: number
  status: Status
  finishedAt: number | null
}

/** Re-renders every `ms` so countdowns stay fresh. */
export function useNow(ms = 60_000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), ms)
    return () => clearInterval(t)
  }, [ms])
  return now
}

export function useCurrentWeek() {
  const now = useNow()
  return weekId(now)
}

export function useWeeks(weeks: string[]) {
  const key = weeks.join(',')
  useEffect(() => {
    watchWeeks(weeks)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
}

export function useWeekSummary(week: string, watch = true): PersonWeek[] {
  useWeeks(watch ? [week] : [])
  const { weeks } = useSync()
  const now = useNow()
  const ticks = weeks[week]
  return useMemo(() => {
    const assign = areasFor(config, week)
    const solo = isSoloWeek(config, week)
    const cleaner = personById(cleanerFor(config, week) ?? '')
    const passed = now > deadlineOf(config, week)
    return config.people.map((person) => {
      const areas = (assign[person.id] ?? []).map((id) => areaById(id)).filter((a): a is Area => Boolean(a))
      const sections = areas.map((area) => ({
        area,
        // Item ids are only unique inside one area, so solo weeks prefix them with the area id.
        items: area.checklist.map((i) => ({ key: solo ? `${area.id}:${i.id}` : i.id, text: i.text })),
      }))
      const area = areas[0]
      const ids = sections.flatMap((s) => s.items.map((i) => i.key))
      const done = doneItems(ticks ?? {}, person.id, ids).length
      const total = ids.length
      return {
        person,
        area,
        sections,
        allAreas: solo && areas.length > 1,
        cleaner,
        done,
        total,
        percent: total ? Math.round((done / total) * 100) : 0,
        status: statusOf(done, total, passed),
        finishedAt: finishedAt(ticks ?? {}, person.id, ids),
      }
    })
  }, [week, ticks, now])
}

export function formatStamp(ms: number) {
  const d = new Date(ms)
  const day = d.toLocaleDateString('en-GB', { weekday: 'short' })
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return `${day} ${time}`
}
