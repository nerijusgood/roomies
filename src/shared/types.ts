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
  /** Solo weeks only: this person (or this group, who share one checklist) cleans everything instead of the normal turn. */
  cleaner?: string | string[]
}

/** A turn: one person, or a group (person ids) who clean together and share one checklist. */
export type Turn = string | string[]

/** One turn cleans ALL areas per week. Takes over from `from`; earlier weeks keep the old area rotation. */
export interface SoloPhase {
  from: string
  /** Turn order. The cycle repeats every `order.length` weeks. */
  order: Turn[]
}

export interface Config {
  houseName: string
  startWeek: string
  deadline: { weekday: number; time: string }
  people: Person[]
  areas: string[]
  overrides: Override[]
  /** Phases, oldest first. A week uses the latest phase whose `from` is not after it. */
  solo?: SoloPhase[]
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
