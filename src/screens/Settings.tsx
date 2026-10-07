import type { ReactNode } from 'react'
import { useLocation } from 'wouter'
import { ArrowsClockwise, DeviceMobile, SignOut, Trash } from '@phosphor-icons/react'
import { personById } from '@/lib/data'
import { logout, useUser } from '@/lib/user'
import { IS_DEMO, resetLocalData, syncNow, useSync } from '@/lib/sync'
import { resetDemo } from '@/lib/demo-api'
import { formatStamp } from '@/lib/house'
import { Avatar } from '@/components/ui'
import { BackHeader } from '@/components/Header'
import { SyncBadge } from '@/components/SyncBadge'

function Row({ children, onClick, icon }: { children: ReactNode; onClick?: () => void; icon?: ReactNode }) {
  const Cmp = onClick ? 'button' : 'div'
  return (
    <Cmp onClick={onClick} className="flex w-full items-center gap-3 border-b border-border/70 py-3.5 text-left text-[15px] last:border-0">
      {icon && <span className="text-lg">{icon}</span>}
      <span className="flex-1">{children}</span>
    </Cmp>
  )
}

export function Settings() {
  const user = useUser()!
  const person = personById(user.id)!
  const { outbox, lastSynced, error } = useSync()
  const [, navigate] = useLocation()

  return (
    <div>
      <BackHeader to="/" />
      <h1 className="mt-4 text-2xl font-medium">Settings</h1>

      <div className="mt-4 flex items-center gap-3 rounded-lg bg-butter p-4">
        <Avatar seed={person.id} size={52} bg="rgba(255,255,255,0.75)" />
        <div>
          <p className="text-xs text-butter-ink">Logged in as</p>
          <p className="text-lg font-medium">{person.name}</p>
        </div>
      </div>

      <div className="mt-3 rounded-lg bg-card px-4 py-1">
        <Row>
          Status <span className="float-right text-sm text-muted-foreground"><SyncBadge /></span>
        </Row>
        <Row>
          Last synced <span className="float-right text-sm text-muted-foreground">{lastSynced ? formatStamp(lastSynced) : 'Never'}</span>
        </Row>
        <Row>
          Waiting to send <span className="float-right text-sm text-muted-foreground">{outbox.length}</span>
        </Row>
        {error && <Row><span className="text-sm text-missed">{error}</span></Row>}
        <Row icon={<ArrowsClockwise />} onClick={() => void syncNow()}>Sync now</Row>
      </div>

      <div className="mt-3 rounded-lg bg-card px-4 py-1">
        <Row icon={<SignOut />} onClick={() => { logout(); navigate('/') }}>Switch user</Row>
        {IS_DEMO ? (
          <Row
            icon={<Trash />}
            onClick={() => {
              resetDemo()
              resetLocalData()
            }}
          >
            Reset demo data
          </Row>
        ) : (
          <Row
            icon={<Trash />}
            onClick={() => {
              if (outbox.length === 0 || confirm('Some ticks are not sent yet. Clear anyway?')) resetLocalData()
            }}
          >
            Clear data on this phone
          </Row>
        )}
      </div>

      <div className="mt-3 rounded-lg bg-cream p-4 text-sm">
        <p className="flex items-center gap-2 font-medium"><DeviceMobile className="text-lg" /> Add to home screen</p>
        <p className="mt-2 text-cream-ink">
          <b>iPhone:</b> open in Safari, tap Share, then "Add to Home Screen".
          <br />
          <b>Android:</b> open in Chrome, tap ⋮, then "Install app".
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">Roomies v0.1{IS_DEMO ? ' · demo, data stays in this browser' : ''}</p>
    </div>
  )
}
