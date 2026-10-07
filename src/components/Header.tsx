import { useEffect, useRef, type ReactNode } from 'react'
import { useLocation } from 'wouter'
import { ArrowUUpLeft } from '@phosphor-icons/react'
import { IconButton } from './ui'

let previous = '/'

/** Remembers the last screen so Back works without browser history (also inside an embedded demo). */
export function useTrackPrevious() {
  const [loc] = useLocation()
  const last = useRef(loc)
  useEffect(() => {
    if (last.current !== loc) {
      previous = last.current
      last.current = loc
    }
  }, [loc])
}

export function BackHeader({ right, to }: { right?: ReactNode; to?: string }) {
  const [, navigate] = useLocation()
  return (
    <div className="flex items-center justify-between">
      <IconButton
        label="Back"
        onClick={() => navigate(to ?? (previous.startsWith('/p/') ? '/' : previous))}
      >
        <ArrowUUpLeft />
      </IconButton>
      {right}
    </div>
  )
}
