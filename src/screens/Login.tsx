import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowUUpLeft } from '@phosphor-icons/react'
import { config } from '@/lib/data'
import { login } from '@/lib/user'
import { Avatar, IconButton, pastel } from '@/components/ui'
import { Doodle } from '@/components/Doodle'
import { cn } from '@/lib/cn'
import { IS_DEMO } from '@/lib/sync'
import type { PastelColor } from '@/shared/types'

const tileColors: PastelColor[] = ['butter', 'lavender', 'peach', 'mint', 'sky', 'cream']

export function Login() {
  const [picked, setPicked] = useState<string | null>(null)
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const person = config.people.find((p) => p.id === picked)

  useEffect(() => {
    if (picked) input.current?.focus()
  }, [picked])

  const onPin = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4)
    setPin(digits)
    setError(false)
    if (digits.length === 4 && picked) {
      if (!login(picked, digits)) {
        setError(true)
        navigator.vibrate?.([40, 40, 40])
        setTimeout(() => setPin(''), 450)
      }
    }
  }

  if (!person) {
    return (
      <div className="pt-6">
        <div className="hero bg-butter">
          <Doodle name="broom" className="absolute -right-2 top-1 h-28 w-36" />
          <p className="text-sm text-butter-ink">Roomies · {config.houseName}</p>
          <h1 className="mt-10 text-3xl font-medium leading-tight">
            Who's
            <br />
            this?
          </h1>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {config.people.map((p, i) => {
            const c = pastel[tileColors[i % tileColors.length]]
            return (
              <button
                key={p.id}
                onClick={() => setPicked(p.id)}
                className={cn('tile items-center justify-center gap-2 transition active:scale-[0.97]', c.bg)}
              >
                <Avatar seed={p.id} size={72} bg="rgba(255,255,255,0.7)" />
                <span className="text-base font-medium">{p.name}</span>
              </button>
            )
          })}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">You only do this once. Your phone remembers you.</p>
        {IS_DEMO && (
          <p className="mx-auto mt-3 w-fit rounded-full bg-card px-4 py-2 text-center text-xs">
            Demo PINs: {config.people.map((p) => `${p.name} ${p.pin}`).join(' · ')}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="pt-2">
      <IconButton label="Back" onClick={() => { setPicked(null); setPin(''); setError(false) }}>
        <ArrowUUpLeft />
      </IconButton>
      <div className="mt-8 flex flex-col items-center text-center">
        <Avatar seed={person.id} size={96} bg="#FFE9A3" />
        <h1 className="mt-4 text-2xl font-medium">Hi {person.name}!</h1>
        <p className="mt-1 text-sm text-muted-foreground">Type your 4-digit PIN</p>
        <motion.label
          className="relative mt-6 flex gap-3"
          animate={error ? { x: [0, -10, 10, -8, 8, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={cn(
                'flex size-14 items-center justify-center rounded-md bg-card text-2xl font-medium',
                pin.length === i && 'ring-2 ring-foreground',
                error && 'ring-2 ring-missed',
              )}
            >
              {pin[i] ? '•' : ''}
            </span>
          ))}
          <input
            ref={input}
            value={pin}
            onChange={(e) => onPin(e.target.value)}
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={4}
            aria-label="PIN"
            className="absolute inset-0 opacity-0"
          />
        </motion.label>
        <p className={cn('mt-4 h-5 text-sm', error ? 'text-missed' : 'text-transparent')}>That's not it. Try again.</p>
      </div>
    </div>
  )
}
