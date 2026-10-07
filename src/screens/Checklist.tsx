import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Markdown from 'react-markdown'
import { CaretDown } from '@phosphor-icons/react'
import { useUser } from '@/lib/user'
import { useSync, tick } from '@/lib/sync'
import { formatStamp, useCurrentWeek, useWeekSummary } from '@/lib/house'
import { motivation, cheer } from '@/lib/copy'
import { celebrate } from '@/lib/celebrate'
import { CheckRow, ProgressRing, pastelOf } from '@/components/ui'
import { BackHeader } from '@/components/Header'
import { Doodle } from '@/components/Doodle'
import { cn } from '@/lib/cn'

export function Checklist() {
  const user = useUser()!
  const week = useCurrentWeek()
  const me = useWeekSummary(week).find((s) => s.person.id === user.id)!
  const { weeks } = useSync()
  const mine = weeks[week]?.[user.id] ?? {}
  const [showHow, setShowHow] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const wasDone = useRef(me.status === 'done')
  const lastTick = useRef(0)

  useEffect(() => {
    if (me.status === 'done' && !wasDone.current) {
      wasDone.current = true
      // Only celebrate when it was this person's tick that finished the list (not on page load).
      if (Date.now() - lastTick.current > 3000) return
      celebrate()
      setToast(cheer(week + user.id))
      const t = setTimeout(() => setToast(null), 3500)
      return () => clearTimeout(t)
    }
    if (me.status !== 'done') wasDone.current = false
  }, [me.status, week, user.id])

  if (!me.area) {
    return (
      <div>
        <BackHeader to="/" />
        <div className="hero mt-4 bg-sky">
          <h1 className="text-2xl font-medium">Free week</h1>
          <p className="mt-1 text-sm text-sky-ink">You have no area this week.</p>
        </div>
      </div>
    )
  }

  const area = me.area
  const c = pastelOf(area.color)

  return (
    <div>
      <BackHeader to="/" />
      <section className={cn('hero mt-4 flex items-center gap-4', c.bg)}>
        <ProgressRing value={me.percent} size={68}>
          {me.done}/{me.total}
        </ProgressRing>
        <div className="relative z-10 min-w-0 flex-1">
          <h1 className="text-2xl font-medium leading-tight">{area.name}</h1>
          <p className={cn('mt-0.5 text-sm', c.ink)}>{motivation(me.done, me.total, week + user.id)}</p>
        </div>
        <Doodle name={area.doodle} className="pointer-events-none absolute -bottom-3 -right-4 h-20 w-24 opacity-90" />
      </section>

      {area.body && (
        <div className="mt-3 rounded-lg bg-card">
          <button onClick={() => setShowHow((v) => !v)} className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium" aria-expanded={showHow}>
            How to do it well
            <CaretDown className={cn('transition', showHow && 'rotate-180')} />
          </button>
          <AnimatePresence initial={false}>
            {showHow && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="md px-4 pb-4 text-muted-foreground">
                  <Markdown>{area.body}</Markdown>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="mt-3 rounded-lg bg-card px-4 py-1">
        {area.checklist.map((item) => {
          const state = mine[item.id]
          const checked = Boolean(state?.done)
          return (
            <CheckRow
              key={item.id}
              text={item.text}
              checked={checked}
              stamp={checked && state ? formatStamp(state.at) : undefined}
              onToggle={() => {
                lastTick.current = Date.now()
                tick(week, item.id, !checked)
              }}
            />
          )
        })}
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">Tick as you go. Everyone sees your progress.</p>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="fixed inset-x-4 bottom-28 z-50 mx-auto max-w-sm rounded-full bg-foreground px-5 py-3 text-center text-sm font-medium text-white"
            role="status"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
