import { useSyncExternalStore } from 'react'
import { config } from './data'

const KEY = 'roomies:user'
interface Saved {
  id: string
  pin: string
}

function read(): Saved | null {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Saved | null
    return v && config.people.some((p) => p.id === v.id) ? v : null
  } catch {
    return null
  }
}

let current = read()
const listeners = new Set<() => void>()

export function login(id: string, pin: string): boolean {
  const p = config.people.find((x) => x.id === id)
  if (!p || p.pin !== pin) return false
  current = { id, pin }
  try {
    localStorage.setItem(KEY, JSON.stringify(current))
  } catch {
    /* private mode: stays logged in for this session only */
  }
  listeners.forEach((l) => l())
  return true
}

export function logout() {
  current = null
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l())
}

export function getUser() {
  return current
}

export function useUser() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => current,
  )
}
