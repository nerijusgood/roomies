import { useLocation, useParams } from 'wouter'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Broom, House, Info as InfoIcon, Oven, Recycle, ShoppingCart, type Icon } from '@phosphor-icons/react'
import { areaById, areas, infoById, infoPages } from '@/lib/data'
import { pastelOf } from '@/components/ui'
import { BackHeader } from '@/components/Header'
import { Doodle } from '@/components/Doodle'
import { cn } from '@/lib/cn'

const icons: Record<string, Icon> = { broom: Broom, recycle: Recycle, house: House, shopping: ShoppingCart, oven: Oven, info: InfoIcon }

export function Info() {
  const [, navigate] = useLocation()
  return (
    <div>
      <h1 className="pt-1 text-2xl font-medium">House guide</h1>
      <p className="text-sm text-muted-foreground">How we keep things nice.</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {infoPages.map((p) => {
          const c = pastelOf(p.color)
          const Ico = icons[p.icon] ?? InfoIcon
          return (
            <button key={p.id} onClick={() => navigate(`/info/${p.id}`)} className={cn('tile text-left transition active:scale-[0.97]', c.bg)}>
              <span className="flex size-10 items-center justify-center rounded-full bg-white/70 text-xl">
                <Ico />
              </span>
              <span className="mt-auto pt-3 text-[15px] font-medium leading-tight">{p.title}</span>
            </button>
          )
        })}
      </div>

      <div className="mb-2.5 mt-6 px-1">
        <h2 className="text-lg font-medium">All areas</h2>
      </div>
      <div className="space-y-2.5">
        {areas.map((a) => {
          const c = pastelOf(a.color)
          return (
            <button key={a.id} onClick={() => navigate(`/area/${a.id}`)} className={cn('flex w-full items-center gap-3 rounded-lg p-3 text-left transition active:scale-[0.98]', c.bg)}>
              <Doodle name={a.doodle} className="h-12 w-16 shrink-0" />
              <span className="flex-1">
                <span className="block text-[15px] font-medium">{a.name}</span>
                <span className={cn('text-xs', c.ink)}>{a.checklist.length} tasks</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function InfoDetail() {
  const { id } = useParams<{ id: string }>()
  const page = infoById(id)
  if (!page) return <NotFound />
  const c = pastelOf(page.color)
  const Ico = icons[page.icon] ?? InfoIcon
  return (
    <div>
      <BackHeader to="/info" />
      <section className={cn('hero mt-4', c.bg)}>
        <span className="flex size-10 items-center justify-center rounded-full bg-white/70 text-xl">
          <Ico />
        </span>
        <h1 className="mt-6 text-2xl font-medium leading-tight">{page.title}</h1>
      </section>
      <div className="md mt-3 rounded-lg bg-card p-4">
        <Markdown remarkPlugins={[remarkGfm]}>{page.body}</Markdown>
      </div>
    </div>
  )
}

export function AreaDetail() {
  const { id } = useParams<{ id: string }>()
  const area = areaById(id)
  if (!area) return <NotFound />
  const c = pastelOf(area.color)
  return (
    <div>
      <BackHeader to="/info" />
      <section className={cn('hero mt-4', c.bg)}>
        <Doodle name={area.doodle} className="absolute -right-3 top-2 h-28 w-36" />
        <p className={cn('mt-12 text-sm', c.ink)}>{area.checklist.length} tasks</p>
        <h1 className="text-2xl font-medium">{area.name}</h1>
      </section>
      {area.body && (
        <div className="md mt-3 rounded-lg bg-card p-4">
          <Markdown remarkPlugins={[remarkGfm]}>{area.body}</Markdown>
        </div>
      )}
      <div className="mt-3 rounded-lg bg-card p-4">
        <h2 className="mb-2 text-sm font-medium">Checklist</h2>
        <ol className="space-y-2 text-[15px]">
          {area.checklist.map((i, n) => (
            <li key={i.id} className="flex gap-3">
              <span className={cn('flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium', c.bg)}>{n + 1}</span>
              {i.text}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div>
      <BackHeader to="/info" />
      <p className="mt-10 text-center text-muted-foreground">Page not found.</p>
    </div>
  )
}
