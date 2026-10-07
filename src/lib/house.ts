import { useEffect, useMemo, useState } from 'react'
import type { Area, Person } from '@/shared/types'
import { assignmentsFor, deadlineOf, statusOf, type Status } from '@/shared/rotation'
import { doneItems, finishedAt } from '@/shared/ticks'
import { weekId } from '@/shared/week'
import { areaById, config } from './data'
import { useSync, watchWeeks } from './sync'

export interface PersonWeek {
  person: Person
  area: Area | undefined
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
    const assign = assignmentsFor(config, week)
    const passed = now > deadlineOf(config, week)
    return config.people.map((person) => {
      const area = areaById(assign[person.id])
      const ids = area?.checklist.map((i) => i.id) ?? []
      const done = doneItems(ticks ?? {}, person.id, ids).length
      const total = ids.length
      return {
        person,
        area,
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
