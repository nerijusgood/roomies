import { useLocation } from 'wouter'
import { config } from '@/lib/data'
import { useCurrentWeek, useWeekSummary, useWeeks } from '@/lib/house'
import { addWeeks, mondayOf, weekNumber } from '@/shared/week'
import { beforeStart, overrideNote } from '@/shared/rotation'
import { Avatar, StatusDot, pastelOf } from '@/components/ui'
import { cn } from '@/lib/cn'

function WeekRow({ week, current }: { week: string; current: string }) {
  const [, navigate] = useLocation()
  const isNow = week === current
  const isPast = week < current
  const showStatus = (isNow || isPast) && !beforeStart(config, week)
  const summary = useWeekSummary(week, showStatus)
  const note = overrideNote(config, week)
  const monday = mondayOf(week)
  const date = monday.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  return (
    <div className={cn('rounded-lg p-2', isNow ? 'bg-card ring-2 ring-foreground' : 'bg-card/60')}>
      <div className="flex items-baseline justify-between px-1.5 pb-1.5 pt-0.5">
        <span className="text-sm font-medium">
          Week {weekNumber(week)}
          {isNow && <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[11px] text-white">This week</span>}
        </span>
        <span className="text-[11px] text-muted-foreground">from {date}</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {summary.map((s) => {
          const c = pastelOf(s.area?.color ?? 'sky')
          return (
            <button
              key={s.person.id}
              onClick={() => navigate(`/p/${s.person.id}/${week}`)}
              className={cn('flex min-h-14 flex-col justify-between rounded-md p-2 text-left transition active:scale-95', c.bg, !isNow && !isPast && 'opacity-80')}
              aria-label={`${s.person.name}: ${s.area?.name ?? 'free'}`}
            >
              <span className="text-[13px] font-medium leading-tight">{s.area?.short ?? 'Free'}</span>
              {showStatus && s.area ? <StatusDot status={s.status} className="mt-1" /> : <span className="h-2.5" />}
            </button>
          )
        })}
      </div>
      {note && <p className="px-1.5 pt-1.5 text-[11px] text-muted-foreground">{note}</p>}
    </div>
  )
}

export function Calendar() {
  const current = useCurrentWeek()
  const weeks = [-2, -1, 0, 1, 2, 3, 4].map((n) => addWeeks(current, n))
  useWeeks(weeks.filter((w) => w <= current && !beforeStart(config, w)))

  return (
    <div>
      <h1 className="pt-1 text-2xl font-medium">Schedule</h1>
      <p className="text-sm text-muted-foreground">Tap a box to see the checklist.</p>

      <div className="sticky top-0 z-10 -mx-4 mt-4 bg-background/95 px-4 py-2 backdrop-blur">
        <div className="grid grid-cols-4 gap-1.5 px-2">
          {config.people.map((p) => (
            <div key={p.id} className="flex flex-col items-center gap-1">
              <Avatar seed={p.id} size={34} />
              <span className="text-[11px] font-medium">{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 space-y-2.5">
        {weeks.map((w) => (
          <WeekRow key={w} week={w} current={current} />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><StatusDot status="done" /> Done</span>
        <span className="inline-flex items-center gap-1.5"><StatusDot status="started" /> Started</span>
        <span className="inline-flex items-center gap-1.5"><StatusDot status="todo" /> Not started</span>
        <span className="inline-flex items-center gap-1.5"><StatusDot status="missed" /> Missed</span>
      </div>
    </div>
  )
}
