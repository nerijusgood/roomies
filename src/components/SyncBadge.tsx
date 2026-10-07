import { useSync } from '@/lib/sync'
import { cn } from '@/lib/cn'

export function SyncBadge({ className }: { className?: string }) {
  const { status, outbox } = useSync()
  const pending = outbox.length
  const label =
    status === 'syncing' ? 'Syncing…' : status === 'offline' ? (pending ? `Offline · ${pending} to send` : 'Offline') : status === 'error' ? 'Sync problem' : pending ? `${pending} to send` : 'Synced'
  const dot = status === 'offline' ? 'bg-started' : status === 'error' ? 'bg-missed' : status === 'syncing' ? 'bg-muted-foreground animate-pulse' : 'bg-done'
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span className={cn('size-1.5 rounded-full', dot)} />
      {label}
    </span>
  )
}
