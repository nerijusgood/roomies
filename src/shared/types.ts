export type PastelColor = 'butter' | 'lavender' | 'peach' | 'mint' | 'cream' | 'sky'

export interface Person {
  id: string
  name: string
  pin: string
  /** Optional seed for a different avatar face. */
  avatar?: string
  /** Area this person has in startWeek. Defaults to the area at the same position in `areas`. */
  startArea?: string
}

export interface Override {
  week: string
  /** Two people trade areas for this week. */
  swap?: [string, string]
  /** Or set areas directly: personId -> areaId (null = away this week). */
  assign?: Record<string, string | null>
  note?: string
}

export interface Config {
  houseName: string
  startWeek: string
  deadline: { weekday: number; time: string }
  people: Person[]
  areas: string[]
  overrides: Override[]
}

export interface ChecklistItem {
  id: string
  text: string
}

export interface Area {
  id: string
  name: string
  short: string
  color: PastelColor
  doodle: string
  checklist: ChecklistItem[]
  body: string
}

export interface InfoPage {
  id: string
  title: string
  icon: string
  color: PastelColor
  order: number
  body: string
}

/** One tick state. done=false is kept (not deleted) so last-write-wins works offline. */
export interface TickState {
  done: boolean
  at: number
}

/** personId -> itemId -> state */
export type WeekTicks = Record<string, Record<string, TickState>>

export interface TickChange {
  week: string
  item: string
  done: boolean
  at: number
}
