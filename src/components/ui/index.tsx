import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { Check } from '@phosphor-icons/react'
import { cn } from '@/lib/cn'
import { avatarUri } from '@/lib/avatar'
import type { PastelColor } from '@/shared/types'
import type { Status } from '@/shared/rotation'

/* ---------- colours ---------- */

export const pastel: Record<PastelColor, { bg: string; ink: string; hex: string }> = {
  butter: { bg: 'bg-butter', ink: 'text-butter-ink', hex: '#FFE9A3' },
  lavender: { bg: 'bg-lavender', ink: 'text-lavender-ink', hex: '#E7E6FB' },
  peach: { bg: 'bg-peach', ink: 'text-peach-ink', hex: '#FDE4DA' },
  mint: { bg: 'bg-mint', ink: 'text-mint-ink', hex: '#D9F3EE' },
  cream: { bg: 'bg-cream', ink: 'text-cream-ink', hex: '#FFF1DC' },
  sky: { bg: 'bg-sky', ink: 'text-sky-ink', hex: '#DDEEFF' },
}
export const pastelOf = (c: string | undefined) => pastel[(c as PastelColor) ?? 'cream'] ?? pastel.cream

/* ---------- buttons ---------- */

type BtnVariant = 'primary' | 'accent' | 'soft'
const btnBase =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100 select-none'
const btnVariant: Record<BtnVariant, string> = {
  primary: 'bg-primary text-primary-foreground',
  accent: 'bg-accent text-accent-foreground',
  soft: 'bg-card text-foreground',
}

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: 'md' | 'lg' }
>(function Button({ variant = 'primary', size = 'md', className, ...props }, ref) {
  return (
    <button
      ref={ref}
      className={cn(btnBase, btnVariant[variant], size === 'lg' ? 'h-13 px-6 text-base' : 'h-11 px-5 text-sm', className)}
      {...props}
    />
  )
})

export function IconButton({
  className,
  label,
  active,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; active?: boolean }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        'icon-btn shrink-0 text-xl transition active:scale-95',
        active ? 'bg-accent text-accent-foreground' : 'bg-card text-foreground',
        className,
      )}
      {...props}
    />
  )
}

/* ---------- avatar ---------- */

export function Avatar({ seed, size = 40, bg = '#FFFFFF', className }: { seed: string; size?: number; bg?: string; className?: string }) {
  return (
    <img
      src={avatarUri(seed)}
      alt=""
      width={size}
      height={size}
      className={cn('shrink-0 rounded-full object-cover', className)}
      style={{ width: size, height: size, background: bg }}
    />
  )
}

/* ---------- progress ---------- */

export function ProgressBar({ value, className, barClass }: { value: number; className?: string; barClass?: string }) {
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-white/70', className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <motion.div
        className={cn('h-full rounded-full bg-foreground', barClass)}
        initial={false}
        animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        transition={{ type: 'spring', stiffness: 160, damping: 22 }}
      />
    </div>
  )
}

export function ProgressRing({
  value,
  size = 64,
  stroke = 7,
  track = 'rgba(255,255,255,0.8)',
  children,
}: {
  value: number
  size?: number
  stroke?: number
  track?: string
  children?: ReactNode
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#1C1C1C"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: c * (1 - Math.max(0, Math.min(100, value)) / 100) }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">{children}</div>
    </div>
  )
}

/* ---------- status ---------- */

const statusText: Record<Status, string> = {
  done: 'All done',
  started: 'On it',
  todo: 'Not started',
  missed: 'Missed',
  free: 'Free week',
}
const statusDot: Record<Status, string> = {
  done: 'bg-done',
  started: 'bg-started',
  todo: 'bg-white border border-foreground/25',
  missed: 'bg-missed',
  free: 'bg-muted',
}

export function StatusPill({ status, percent, className }: { status: Status; percent?: number; className?: string }) {
  const label = status === 'started' && percent != null ? `${percent}%` : statusText[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium', className)}>
      <span className={cn('size-2 rounded-full', statusDot[status])} />
      {label}
    </span>
  )
}

export function StatusDot({ status, className }: { status: Status; className?: string }) {
  return <span className={cn('inline-block size-2.5 rounded-full', statusDot[status], className)} aria-label={statusText[status]} />
}

/* ---------- checklist row ---------- */

export function CheckRow({
  text,
  checked,
  stamp,
  onToggle,
  readOnly,
}: {
  text: string
  checked: boolean
  stamp?: string
  onToggle?: () => void
  readOnly?: boolean
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={readOnly}
      onClick={onToggle}
      className="flex w-full items-center gap-3 border-b border-border/70 py-3.5 text-left last:border-0 disabled:cursor-default"
    >
      <motion.span
        className={cn(
          'flex size-7 shrink-0 items-center justify-center rounded-full border-2',
          checked ? 'border-foreground bg-foreground text-white' : 'border-foreground/80 bg-white',
        )}
        animate={checked ? { scale: [1, 1.25, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {checked && <Check weight="bold" className="text-sm" />}
      </motion.span>
      <span className={cn('flex-1 text-[15px] leading-snug', checked && 'text-muted-foreground line-through')}>{text}</span>
      {stamp && <span className="shrink-0 text-[11px] text-muted-foreground">{stamp}</span>}
    </button>
  )
}

/* ---------- layout ---------- */

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('rounded-lg bg-card p-4', className)}>{children}</div>
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-2.5 mt-6 flex items-baseline justify-between px-1">
      <h2 className="text-lg font-medium">{children}</h2>
      {action && <div className="text-xs text-muted-foreground">{action}</div>}
    </div>
  )
}
