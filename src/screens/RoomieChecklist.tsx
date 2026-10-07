import { useParams } from 'wouter'
import { useSync } from '@/lib/sync'
import { formatStamp, useCurrentWeek, useWeekSummary } from '@/lib/house'
import { isValidWeekId, weekNumber } from '@/shared/week'
import { Avatar, CheckRow, ProgressBar, StatusPill, pastelOf } from '@/components/ui'
import { BackHeader } from '@/components/Header'
import { Doodle } from '@/components/Doodle'
import { cn } from '@/lib/cn'

export function RoomieChecklist() {
  const params = useParams<{ person: string; week?: string }>()
  const current = useCurrentWeek()
  const week = params.week && isValidWeekId(params.week) ? params.week : current
  const entry = useWeekSummary(week).find((s) => s.person.id === params.person)
  const { weeks } = useSync()

  if (!entry) {
    return (
      <div>
        <BackHeader />
        <p className="mt-10 text-center text-muted-foreground">Can't find that roomie.</p>
      </div>
    )
  }
  const ticks = weeks[week]?.[entry.person.id] ?? {}
  const c = pastelOf(entry.area?.color ?? 'sky')

  return (
    <div>
      <BackHeader />
      <section className={cn('hero mt-4', c.bg)}>
        {entry.area && <Doodle name={entry.area.doodle} className="pointer-events-none absolute -right-2 top-1 h-20 w-24" />}
        <div className="relative flex items-center gap-3 pr-20">
          <Avatar seed={entry.person.id} size={52} bg="rgba(255,255,255,0.75)" />
          <div>
            <p className={cn('text-sm', c.ink)}>
              {entry.person.name} · week {weekNumber(week)}
              {week === current ? ' (now)' : ''}
            </p>
            <h1 className="text-2xl font-medium leading-tight">{entry.area?.name ?? 'Free week'}</h1>
          </div>
        </div>
        {entry.area && (
          <div className="relative mt-5">
            <div className="flex items-center justify-between">
              <StatusPill status={entry.status} percent={entry.percent} />
              <span className={cn('text-xs', c.ink)}>
                {entry.finishedAt ? `Finished ${formatStamp(entry.finishedAt)}` : `${entry.done} / ${entry.total} done`}
              </span>
            </div>
            <ProgressBar value={entry.percent} className="mt-3" barClass={entry.status === 'done' ? 'bg-done' : undefined} />
          </div>
        )}
      </section>

      {entry.area && (
        <>
          <div className="mt-3 rounded-lg bg-card px-4 py-1">
            {entry.area.checklist.map((item) => {
              const s = ticks[item.id]
              return <CheckRow key={item.id} text={item.text} checked={Boolean(s?.done)} stamp={s?.done ? formatStamp(s.at) : undefined} readOnly />
            })}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">View only · you can't tick for others</p>
        </>
      )}
    </div>
  )
}
