import fs from 'node:fs'
import path from 'node:path'
import type { WeekTicks } from '../src/shared/types'
import type { TickStore } from './logic'

/** Local dev store: everything in one JSON file (data/ticks.json). */
export function fileStore(file: string): TickStore {
  const read = (): Record<string, WeekTicks> => {
    try {
      return JSON.parse(fs.readFileSync(file, 'utf8'))
    } catch {
      return {}
    }
  }
  return {
    async getWeek(week) {
      return read()[week] ?? {}
    },
    async saveWeek(week, ticks) {
      const all = read()
      all[week] = ticks
      fs.mkdirSync(path.dirname(file), { recursive: true })
      fs.writeFileSync(file, JSON.stringify(all, null, 2))
    },
  }
}
