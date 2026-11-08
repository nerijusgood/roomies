import { useState } from 'react'
import { useLocation } from 'wouter'
import type { PastelColor, Person } from '@/shared/types'
import { config } from '@/lib/data'
import { useCurrentWeek, useWeekSummary, useWeeks, type PersonWeek } from '@/lib/house'
import { addWeeks, mondayOf, weekNumber } from '@/shared/week'
import { beforeStart, cleanersFor, isSoloWeek, nextTurn, overrideNote } from '@/shared/rotation'
import { Avatar, StatusDot, pastelOf } from '@/components/ui'
import { cn } from '@/lib/cn'

/** Calendar columns: people who clean together (a group turn in the latest phase) sit side by side. */
const columns: Person[] = (() => {
  const latest = [...(config.solo ?? [])].sort((a, b) => a.from.localeCompare(b.from)).at(-1)
  const group = latest?.order.find((t): t is string[] => Array.isArray(t)) ?? []
  const together = group.map((id) => config.people.find((p) => p.id === id)).filter((p): p is Person => Boolean(p))
  return [...together, ...config.people.filter((p) => !group.includes(p.id))]
})()

/** One box per person, except people cleaning together share a single joined box. */
function boxesOf(summary: PersonWeek[]): PersonWeek[][] {
  const ordered = columns.map((p) => summary.find((s) => s.person.id === p.id)).filter((s): s is PersonWeek => Boolean(s))
  const boxes: PersonWeek[][] = []
  for (let i = 0; i < ordered.length; ) {
    const s = ordered[i]
    const n = s.mates.length + 1
    const group = ordered.slice(i, i + n)
    const together = n > 1 && group.every((g) => g === s || s.mates.some((m) => m.id === g.person.id))
    boxes.push(together ? group : [s])
    i += together ? n : 1
  }
  return boxes
}

function WeekRow({ week, current, selected }: { week: string; current: string; selected: string | null }) {
  const [, navigate] = useLocation()
  const isNow = week === current
  const isPast = week < current
  const showStatus = (isNow || isPast) && !beforeStart(config, week)
  const summary = useWeekSummary(week, showStatus)
  const note = overrideNote(config, week)
  const monday = mondayOf(week)
  const date = monday.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const mine = selected ? Boolean(summary.find((s) => s.person.id === selected)?.area) : false
  const faded = selected !== null && !mine
  return (
    <div className={cn('rounded-lg p-2 transition-opacity', isNow ? 'bg-card ring-2 ring-foreground' : 'bg-card/60', faded && 'opacity-35')}>
      <div className="flex items-baseline justify-between px-1.5 pb-1.5 pt-0.5">
        <span className="text-sm font-medium">
          Week {weekNumber(week)}
          {isNow && <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[11px] text-white">This week</span>}
        </span>
        <span className="text-[11px] text-muted-foreground">from {date}</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {boxesOf(summary).map((group) => {
          const s = group[0]
          const together = group.length > 1
          const label = together ? group.map((g) => g.person.name).join(' + ') : s.person.name
          const c = pastelOf(s.area?.color ?? 'sky')
          const picked = mine && group.some((g) => g.person.id === selected)
          return (
            <button
              key={s.person.id}
              onClick={() => navigate(`/p/${s.person.id}/${week}`)}
              style={together ? { gridColumn: `span ${group.length}` } : undefined}
              className={cn(
                'flex min-h-14 flex-col justify-between rounded-md p-2 text-left transition active:scale-95',
                c.bg,
                !isNow && !isPast && 'opacity-80',
                picked && 'opacity-100 ring-2 ring-foreground',
              )}
              aria-label={`${label}: ${s.allAreas ? 'all areas' : (s.area?.name ?? 'free')}${together ? ' together' : ''}`}
            >
              <span className="text-[13px] font-medium leading-tight">
                {s.allAreas ? 'All' : (s.area?.short ?? 'Free')}
                {together && <span className="block text-[11px] font-normal opacity-70">{label}</span>}
              </span>
              {showStatus && s.area ? <StatusDot status={s.status} className="mt-1" /> : <span className="h-2.5" />}
            </button>
          )
        })}
      </div>
      {note && <p className="px-1.5 pt-1.5 text-[11px] text-muted-foreground">{note}</p>}
    </div>
  )
}

/** Fixed colour per person in the list view, by position in the config. */
const PERSON_COLORS: PastelColor[] = ['butter', 'lavender', 'mint', 'peach', 'sky', 'cream']
const colorOfPerson = (id: string) => PERSON_COLORS[Math.max(0, config.people.findIndex((p) => p.id === id)) % PERSON_COLORS.length]

/** List view: one row per week, with the name (or two names in two colours) of whoever cleans. */
function ListRow({ week, current, selected }: { week: string; current: string; selected: string | null }) {
  const [, navigate] = useLocation()
  const isNow = week === current
  const isPast = week < current
  const showStatus = (isNow || isPast) && !beforeStart(config, week)
  const onDuty = useWeekSummary(week, showStatus).filter((s) => s.area)
  const first = onDuty[0]
  const faded = selected !== null && !onDuty.some((o) => o.person.id === selected)
  const date = mondayOf(week).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  return (
    <button
      onClick={() => first && navigate(`/p/${first.person.id}/${week}`)}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition active:scale-[0.98]',
        'transition-opacity',
        isNow ? 'bg-card ring-2 ring-foreground' : 'bg-card/60',
        faded && 'opacity-35',
      )}
      aria-label={`Week ${weekNumber(week)}: ${onDuty.map((o) => o.person.name).join(' and ')}`}
    >
      <div className="w-20 shrink-0 pl-1">
        <p className="text-sm font-medium">Week {weekNumber(week)}</p>
        <p className="text-[11px] text-muted-foreground">from {date}</p>
        {isNow && <span className="mt-0.5 inline-block rounded-full bg-accent px-2 py-0.5 text-[11px] text-white">This week</span>}
      </div>
      <div className="flex min-w-0 flex-1 gap-1.5">
        {onDuty.map((o) => {
          const c = pastelOf(colorOfPerson(o.person.id))
          return (
            <span
              key={o.person.id}
              className={cn('min-w-0 flex-1 truncate rounded-md px-3 py-2.5 text-sm font-medium', c.bg, c.ink, o.person.id === selected && 'ring-2 ring-foreground')}
            >
              {o.person.name}
            </span>
          )
        })}
      </div>
      {showStatus && first ? <StatusDot status={first.status} className="mr-1 shrink-0" /> : <span className="mr-1 size-2.5 shrink-0" />}
    </button>
  )
}

function turnSummary(personId: string, current: string): string {
  const person = config.people.find((p) => p.id === personId)
  const week = nextTurn(config, personId, current)
  if (!person) return ''
  if (!week) return `${person.name} has no upcoming turn.`
  const mates = cleanersFor(config, week)
    .filter((id) => id !== personId)
    .map((id) => config.people.find((p) => p.id === id)?.name)
    .filter(Boolean)
  const withMates = mates.length ? ` with ${mates.join(' and ')}` : ''
  if (week === current) return `${person.name} cleans this week${withMates}.`
  const from = mondayOf(week).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  return `${person.name} cleans next${withMates}: week ${weekNumber(week)} · from ${from}.`
}

export function Calendar() {
  const current = useCurrentWeek()
  const [selected, setSelected] = useState<string | null>(null)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const weeks = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => addWeeks(current, n))
  const listWeeks = Array.from({ length: 13 }, (_, i) => addWeeks(current, i - 1)).filter((w) => isSoloWeek(config, w))
  useWeeks((view === 'grid' ? weeks : listWeeks).filter((w) => w <= current && !beforeStart(config, w)))

  return (
    <div>
      <h1 className="pt-1 text-2xl font-medium">Schedule</h1>
      <p className="text-sm text-muted-foreground">
        {view === 'grid' ? 'Tap a box to see the checklist, or a person to see when they clean.' : 'Tap a week to see the checklist, or a person to see when they clean.'}
      </p>

      <div className="mt-3 inline-flex rounded-full bg-card p-1" role="group" aria-label="Schedule view">
        {(['grid', 'list'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            aria-pressed={view === v}
            className={cn('rounded-full px-4 py-1.5 text-sm font-medium transition', view === v ? 'bg-foreground text-white' : 'text-muted-foreground')}
          >
            {v === 'grid' ? 'Grid' : 'List'}
          </button>
        ))}
      </div>

      <div className="sticky top-0 z-10 -mx-4 mt-4 bg-background/95 px-4 py-2 backdrop-blur">
        <div className="grid grid-cols-4 gap-1.5 px-2">
          {columns.map((p) => {
            const on = selected === p.id
            return (
              <button
                key={p.id}
                onClick={() => setSelected(on ? null : p.id)}
                aria-pressed={on}
                aria-label={`${p.name}: highlight when they clean`}
                className={cn('flex flex-col items-center gap-1 rounded-md py-1 transition active:scale-95', selected && !on && 'opacity-50')}
              >
                <span className={cn('rounded-full', on && 'ring-2 ring-foreground ring-offset-2 ring-offset-background')}>
                  <Avatar seed={p.id} size={34} />
                </span>
                <span className={cn('text-[11px]', on ? 'font-semibold' : 'font-medium')}>{p.name}</span>
              </button>
            )
          })}
        </div>
        {selected && (
          <p className="mt-1.5 px-2 text-center text-xs text-muted-foreground" role="status">
            {turnSummary(selected, current)}{' '}
            <button onClick={() => setSelected(null)} className="font-medium text-foreground underline">
              Show all
            </button>
          </p>
        )}
      </div>

      {view === 'list' ? (
        <div className="mt-2 space-y-2">
          {listWeeks.map((w) => (
            <ListRow key={w} week={w} current={current} selected={selected} />
          ))}
        </div>
      ) : (
        <div className="mt-2 space-y-2.5">
          {weeks.map((w) => (
            <WeekRow key={w} week={w} current={current} selected={selected} />
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><StatusDot status="done" /> Done</span>
        <span className="inline-flex items-center gap-1.5"><StatusDot status="started" /> Started</span>
        <span className="inline-flex items-center gap-1.5"><StatusDot status="todo" /> Not started</span>
        <span className="inline-flex items-center gap-1.5"><StatusDot status="missed" /> Missed</span>
      </div>
    </div>
  )
}
