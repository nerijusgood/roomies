import { Route, Router, Switch, useLocation } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'
import { memoryLocation } from 'wouter/memory-location'
import { IS_DEMO } from './lib/sync'
import { useTrackPrevious } from './components/Header'
import { CalendarBlank, House, BookOpenText } from '@phosphor-icons/react'
import { useUser } from './lib/user'
import { IconButton } from './components/ui'
import { Login } from './screens/Login'
import { MyWeek } from './screens/MyWeek'
import { Checklist } from './screens/Checklist'
import { RoomieChecklist } from './screens/RoomieChecklist'
import { Calendar } from './screens/Calendar'
import { Info, InfoDetail, AreaDetail } from './screens/Info'
import { Settings } from './screens/Settings'

// The embedded demo keeps routes in memory instead of the URL hash.
const routerHook = IS_DEMO ? memoryLocation({ path: '/' }).hook : useHashLocation

function BottomNav() {
  useTrackPrevious()
  const [loc, navigate] = useLocation()
  const tab = loc.startsWith('/calendar') ? 'calendar' : loc.startsWith('/info') || loc.startsWith('/area') ? 'info' : 'home'
  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[max(env(safe-area-inset-bottom),16px)]">
      <div className="pointer-events-auto flex gap-2 rounded-full bg-card p-1.5 shadow-[0_8px_30px_rgba(28,28,28,0.10)]">
        <IconButton label="My week" active={tab === 'home'} onClick={() => navigate('/')} className={tab !== 'home' ? 'border-[1.5px] border-foreground bg-background' : ''}>
          <House weight={tab === 'home' ? 'fill' : 'regular'} />
        </IconButton>
        <IconButton label="Calendar" active={tab === 'calendar'} onClick={() => navigate('/calendar')} className={tab !== 'calendar' ? 'border-[1.5px] border-foreground bg-background' : ''}>
          <CalendarBlank weight={tab === 'calendar' ? 'fill' : 'regular'} />
        </IconButton>
        <IconButton label="House guide" active={tab === 'info'} onClick={() => navigate('/info')} className={tab !== 'info' ? 'border-[1.5px] border-foreground bg-background' : ''}>
          <BookOpenText weight={tab === 'info' ? 'fill' : 'regular'} />
        </IconButton>
      </div>
    </nav>
  )
}

export function App() {
  const user = useUser()
  return (
    <Router hook={routerHook}>
      <div className="mx-auto min-h-dvh max-w-md px-4 pb-28 pt-[max(env(safe-area-inset-top),16px)]">
        {!user ? (
          <Login />
        ) : (
          <>
            <Switch>
              <Route path="/" component={MyWeek} />
              <Route path="/checklist" component={Checklist} />
              <Route path="/p/:person/:week?" component={RoomieChecklist} />
              <Route path="/calendar" component={Calendar} />
              <Route path="/info" component={Info} />
              <Route path="/info/:id" component={InfoDetail} />
              <Route path="/area/:id" component={AreaDetail} />
              <Route path="/settings" component={Settings} />
              <Route component={MyWeek} />
            </Switch>
            <BottomNav />
          </>
        )}
      </div>
    </Router>
  )
}
