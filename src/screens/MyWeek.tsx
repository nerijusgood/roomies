import { Link, useLocation } from 'wouter'
import { BookOpenText, CheckCircle, GearSix, Info } from '@phosphor-icons/react'
import { config, infoPages } from '@/lib/data'
import { useUser } from '@/lib/user'
import { formatStamp, useCurrentWeek, useNow, useWeekSummary } from '@/lib/house'
import { countdown, deadlineOf, overrideNote } from '@/shared/rotation'
import { weekNumber } from '@/shared/week'
import { greeting, motivation } from '@/lib/copy'
import { Avatar, Button, IconButton, ProgressBar, StatusPill, pastelOf } from '@/components/ui'
import { Doodle } from '@/components/Doodle'
import { SyncBadge } from '@/components/SyncBadge'
import { cn } from '@/lib/cn'

export function MyWeek() {
  const user = useUser()!
  const [, navigate] = useLocation()
  const now = useNow()
  const week = useCurrentWeek()
  const summary = useWeekSummary(week)
  const me = summary.find((s) => s.person.id === user.id)!
  const others = summary.filter((s) => s.person.id !== user.id)
  const deadline = deadlineOf(config, week)
  const due = countdown(deadline, now)
  const dueDay = `${deadline.toLocaleDateString('en-GB', { weekday: 'short' })} ${config.deadline.time}`
  const note = overrideNote(config, week)
  const c = pastelOf(me.area?.color)

  return (
    <div>
      <header className="flex items-center gap-3">
        <Avatar seed={me.person.id} size={44} bg="#FFE9A3" />
        <div className="flex-1">
          <p className="text-base font-medium">
            {greeting(now)}, {me.person.name}
          </p>
          <p className="text-xs text-muted-foreground">
            Week {weekNumber(week)} · <SyncBadge />
          </p>
        </div>
        <IconButton label="Settings" onClick={() => navigate('/settings')}>
          <GearSix />
        </IconButton>
      </header>

      {note && (
        <div className="mt-3 flex items-center gap-2 rounded-md bg-card px-3 py-2 text-sm">
          <Info className="shrink-0 text-accent" weight="fill" /> {note}
        </div>
      )}

      {me.area ? (
        <section className={cn('hero mt-4', c.bg)}>
          <Doodle name={me.area.doodle} className="absolute -right-3 top-2 h-32 w-40" />
          <div className="relative">
            <div className="flex size-9 items-center justify-center rounded-full bg-white/70">
              {me.status === 'done' ? <CheckCircle weight="fill" className="text-done text-xl" /> : <span className="text-sm font-medium">{me.percent}%</span>}
            </div>
            <p className={cn('mt-8 text-sm', c.ink)}>This week you're on</p>
            <h1 className="text-[28px] font-medium leading-tight">{me.area.name}</h1>
            <p className={cn('mt-1 text-sm', c.ink, due.urgent && me.status !== 'done' && 'font-medium')}>
              {me.status === 'done' && me.finishedAt ? `Finished ${formatStamp(me.finishedAt)}` : due.passed ? `Deadline was ${dueDay}` : `${due.label} · until ${dueDay}`}
            </p>
            <ProgressBar value={me.percent} className="mt-4" />
            <div className="mt-4 flex items-center gap-3">
              <Button onClick={() => navigate('/checklist')}>{me.status === 'done' ? 'See my list' : 'Open checklist'}</Button>
              <span className="text-sm font-medium">
                {me.done} / {me.total}
              </span>
            </div>
            <p className={cn('mt-3 text-xs', c.ink)}>{motivation(me.done, me.total, week + me.person.id)}</p>
          </div>
        </section>
      ) : (
        <section className="hero mt-4 bg-sky">
          <Doodle name="sparkle" className="absolute -right-3 top-2 h-32 w-40" />
          <p className="mt-10 text-sm text-sky-ink">This week</p>
          <h1 className="text-[28px] font-medium">Free week!</h1>
          <p className="mt-1 text-sm text-sky-ink">Nothing on your list. Enjoy.</p>
        </section>
      )}

      <div className="mb-2.5 mt-6 flex items-baseline justify-between px-1">
        <h2 className="text-lg font-medium">The house</h2>
        <Link href="/calendar" className="text-xs text-muted-foreground">
          See calendar
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {others.map((o) => {
          const oc = pastelOf(o.area?.color ?? 'sky')
          return (
            <button
              key={o.person.id}
              onClick={() => navigate(`/p/${o.person.id}`)}
              className={cn('tile text-left transition active:scale-[0.97]', oc.bg)}
            >
              <div className="flex items-start justify-between">
                <Avatar seed={o.person.id} size={36} bg="rgba(255,255,255,0.75)" />
                <StatusPill status={o.status} percent={o.percent} />
              </div>
              <div className="mt-auto pt-3">
                <p className={cn('text-xs', oc.ink)}>{o.person.name}</p>
                <p className="text-[15px] font-medium leading-tight">{o.area?.short ?? 'Free week'}</p>
                {o.area && <ProgressBar value={o.percent} className="mt-2" barClass={o.status === 'done' ? 'bg-done' : undefined} />}
              </div>
            </button>
          )
        })}
        <button onClick={() => navigate('/info')} className="tile bg-cream text-left transition active:scale-[0.97]">
          <div className="flex size-9 items-center justify-center rounded-full bg-white/70 text-lg">
            <BookOpenText />
          </div>
          <div className="mt-auto pt-3">
            <p className="text-xs text-cream-ink">{infoPages.length} pages</p>
            <p className="text-[15px] font-medium leading-tight">House guide</p>
          </div>
        </button>
      </div>
    </div>
  )
}
