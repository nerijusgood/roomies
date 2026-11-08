import { describe, expect, it } from 'vitest'
import type { Config } from './types'
import { areasFor, assignmentsFor, cleanersFor, countdown, nextTurn, deadlineLabel, deadlineOf, isSoloWeek, statusOf } from './rotation'
import { addWeeks, mondayOf, weekId, weeksBetween } from './week'
import { mergeTicks, finishedAt, groupTicks } from './ticks'
import { handlePostTicks, handleGetWeek, type TickStore } from '../../server/logic'

const config: Config = {
  houseName: 'Test',
  startWeek: '2026-W41',
  deadline: { weekday: 7, time: '21:00' },
  people: [
    { id: 'a', name: 'A', pin: '1111' },
    { id: 'b', name: 'B', pin: '2222' },
    { id: 'c', name: 'C', pin: '3333' },
    { id: 'd', name: 'D', pin: '4444' },
  ],
  areas: ['living', 'kitchen', 'bath', 'hall'],
  overrides: [{ week: '2026-W44', swap: ['b', 'd'] }, { week: '2026-W45', assign: { a: null } }],
}

describe('weeks', () => {
  it('computes ISO week ids', () => {
    expect(weekId(new Date(2026, 9, 7))).toBe('2026-W41')
    expect(weekId(new Date(2027, 0, 1))).toBe('2026-W53')
    expect(weekId(new Date(2027, 0, 4))).toBe('2027-W01')
  })
  it('adds weeks across years', () => {
    expect(addWeeks('2026-W52', 2)).toBe('2027-W01')
    expect(weeksBetween('2026-W41', '2027-W01')).toBe(13)
  })
  it('finds monday', () => {
    expect(mondayOf('2026-W41').toDateString()).toBe(new Date(2026, 9, 5).toDateString())
  })
})

describe('rotation', () => {
  it('starts in config order', () => {
    expect(assignmentsFor(config, '2026-W41')).toEqual({ a: 'living', b: 'kitchen', c: 'bath', d: 'hall' })
  })
  it('rotates one step per week and wraps', () => {
    expect(assignmentsFor(config, '2026-W42')).toEqual({ a: 'kitchen', b: 'bath', c: 'hall', d: 'living' })
    expect(assignmentsFor({ ...config, overrides: [] }, '2026-W45')).toEqual(assignmentsFor(config, '2026-W41'))
    expect(assignmentsFor(config, '2026-W40')).toEqual({ a: 'hall', b: 'living', c: 'kitchen', d: 'bath' })
  })
  it('everyone gets a different area each week', () => {
    for (let i = 0; i < 20; i++) {
      const values = Object.values(assignmentsFor({ ...config, overrides: [] }, addWeeks('2026-W41', i)))
      expect(new Set(values).size).toBe(4)
    }
  })
  it('applies overrides', () => {
    // W44 base: a hall, b living, c kitchen, d bath -> b and d swap
    expect(assignmentsFor(config, '2026-W44')).toEqual({ a: 'hall', b: 'bath', c: 'kitchen', d: 'living' })
    expect(assignmentsFor(config, '2026-W45').a).toBeNull()
  })
  it('respects startArea so people can be listed in any order', () => {
    const c = {
      ...config,
      overrides: [],
      people: [
        { id: 'a', name: 'A', pin: '1', startArea: 'living' },
        { id: 'b', name: 'B', pin: '2', startArea: 'hall' },
        { id: 'c', name: 'C', pin: '3', startArea: 'bath' },
        { id: 'd', name: 'D', pin: '4', startArea: 'kitchen' },
      ],
    }
    expect(assignmentsFor(c, '2026-W41')).toEqual({ a: 'living', b: 'hall', c: 'bath', d: 'kitchen' })
    expect(assignmentsFor(c, '2026-W42')).toEqual({ a: 'kitchen', b: 'living', c: 'hall', d: 'bath' })
  })
  it('gives free weeks when there are more people than areas', () => {
    const w = assignmentsFor({ ...config, areas: ['living', 'kitchen', 'bath'], overrides: [] }, '2026-W41')
    expect(Object.values(w).filter((v) => v === null)).toHaveLength(1)
  })
})

describe('solo rota (whoever is on duty cleans all areas)', () => {
  const solo: Config = {
    ...config,
    overrides: [],
    solo: [
      { from: '2026-W44', order: ['b', 'c'] },
      { from: '2026-W46', order: ['a', ['b', 'c'], 'd', ['b', 'c']] },
    ],
  }
  const all = ['living', 'kitchen', 'bath', 'hall']
  it('keeps the old rotation before the first phase', () => {
    expect(isSoloWeek(solo, '2026-W43')).toBe(false)
    expect(cleanersFor(solo, '2026-W43')).toEqual([])
    expect(areasFor(solo, '2026-W43').a).toEqual(['bath'])
  })
  it('gives one person every area and the rest none', () => {
    expect(areasFor(solo, '2026-W44')).toEqual({ a: [], b: all, c: [], d: [] })
  })
  it('switches to the next phase on its start week', () => {
    expect(cleanersFor(solo, '2026-W44')).toEqual(['b'])
    expect(cleanersFor(solo, '2026-W45')).toEqual(['c'])
    expect(cleanersFor(solo, '2026-W46')).toEqual(['a'])
  })
  it('repeats the 4-week cycle, with the pair on every second week', () => {
    const order = Array.from({ length: 8 }, (_, i) => cleanersFor(solo, addWeeks('2026-W46', i)))
    expect(order).toEqual([['a'], ['b', 'c'], ['d'], ['b', 'c'], ['a'], ['b', 'c'], ['d'], ['b', 'c']])
  })
  it('gives every area to each member of a group turn', () => {
    expect(areasFor(solo, '2026-W47')).toEqual({ a: [], b: all, c: all, d: [] })
  })
  it('cleaner override replaces the turn, and can be a group', () => {
    const c = { ...solo, overrides: [{ week: '2026-W46', cleaner: 'd' }, { week: '2026-W48', cleaner: ['a', 'd'] }] }
    expect(cleanersFor(c, '2026-W46')).toEqual(['d'])
    expect(cleanersFor(c, '2026-W47')).toEqual(['b', 'c'])
    expect(cleanersFor(c, '2026-W48')).toEqual(['a', 'd'])
  })
})

describe('nextTurn', () => {
  const solo: Config = {
    ...config,
    overrides: [],
    solo: [{ from: '2026-W46', order: ['a', ['b', 'c'], 'd', ['b', 'c']] }],
  }
  it('finds the next week someone cleans, including the current week', () => {
    expect(nextTurn(solo, 'a', '2026-W46')).toBe('2026-W46')
    expect(nextTurn(solo, 'a', '2026-W47')).toBe('2026-W50')
    expect(nextTurn(solo, 'c', '2026-W48')).toBe('2026-W49')
    expect(nextTurn(solo, 'd', '2026-W47')).toBe('2026-W48')
  })
  it('returns null when nothing comes up', () => {
    expect(nextTurn({ ...solo, solo: [{ from: '2026-W46', order: ['a'] }] }, 'b', '2026-W46')).toBeNull()
  })
})

describe('shared checklist for people cleaning together', () => {
  it('counts a tick by either member, newest wins', () => {
    const ticks = {
      b: { x: { done: true, at: 10 }, y: { done: true, at: 10 } },
      c: { y: { done: false, at: 20 }, z: { done: true, at: 5 } },
    }
    const g = groupTicks(ticks, ['b', 'c'])
    expect(g.x.done).toBe(true)
    expect(g.y.done).toBe(false)
    expect(g.z.done).toBe(true)
    expect(finishedAt({ b: g }, 'b', ['x', 'z'])).toBe(10)
  })
})

describe('deadline + status', () => {
  it('midnight deadline is the start of Monday and counts as Sunday', () => {
    const cfg = { ...config, deadline: { weekday: 7, time: '24:00' } }
    const d = deadlineOf(cfg, '2026-W41')
    expect(d.getDay()).toBe(1)
    expect(d.getHours()).toBe(0)
    expect(d.getDate()).toBe(12)
    expect(deadlineLabel(cfg, '2026-W41')).toBe('Sun midnight')
    expect(countdown(d, new Date(2026, 9, 11, 10)).label).toBe('Today, until midnight')
    expect(countdown(d, new Date(2026, 9, 12, 0, 1)).passed).toBe(true)
  })
  it('deadline is Sunday 21:00', () => {
    const d = deadlineOf(config, '2026-W41')
    expect(d.getDay()).toBe(0)
    expect(d.getHours()).toBe(21)
    expect(d.getDate()).toBe(11)
  })
  it('countdown labels', () => {
    const d = deadlineOf(config, '2026-W41')
    expect(countdown(d, new Date(2026, 9, 7, 10)).label).toBe('5 days left')
    expect(countdown(d, new Date(2026, 9, 11, 10)).label).toBe('Today, until 21:00')
    expect(countdown(d, new Date(2026, 9, 12)).passed).toBe(true)
  })
  it('status', () => {
    expect(statusOf(0, 5, false)).toBe('todo')
    expect(statusOf(2, 5, false)).toBe('started')
    expect(statusOf(5, 5, true)).toBe('done')
    expect(statusOf(2, 5, true)).toBe('missed')
  })
})

describe('ticks', () => {
  it('newest change wins', () => {
    const a = { x: { i: { done: true, at: 10 } } }
    const b = { x: { i: { done: false, at: 5 } } }
    expect(mergeTicks(a, b).x.i.done).toBe(true)
    expect(mergeTicks(b, a).x.i.done).toBe(true)
    expect(mergeTicks(a, { x: { i: { done: false, at: 20 } } }).x.i.done).toBe(false)
  })
  it('finishedAt is the last tick when all done', () => {
    const t = { x: { i: { done: true, at: 10 }, j: { done: true, at: 30 } } }
    expect(finishedAt(t, 'x', ['i', 'j'])).toBe(30)
    expect(finishedAt(t, 'x', ['i', 'j', 'k'])).toBeNull()
  })
})

describe('api logic', () => {
  const mem = (): TickStore => {
    const data: Record<string, any> = {}
    return { getWeek: async (w) => data[w] ?? {}, saveWeek: async (w, t) => void (data[w] = t) }
  }
  it('rejects wrong PIN', async () => {
    const r = await handlePostTicks(mem(), config, { person: 'a', pin: '9999', changes: [] })
    expect(r.status).toBe(401)
  })
  it('stores and returns ticks', async () => {
    const store = mem()
    const at = Date.now()
    await handlePostTicks(store, config, { person: 'a', pin: '1111', changes: [{ week: '2026-W41', item: 'vacuum', done: true, at }] })
    const r = (await handleGetWeek(store, '2026-W41')).body as any
    expect(r.ticks.a.vacuum).toEqual({ done: true, at })
  })
  it('older offline change does not overwrite a newer one', async () => {
    const store = mem()
    const now = Date.now()
    await handlePostTicks(store, config, { person: 'a', pin: '1111', changes: [{ week: '2026-W41', item: 'v', done: true, at: now }] })
    await handlePostTicks(store, config, { person: 'a', pin: '1111', changes: [{ week: '2026-W41', item: 'v', done: false, at: now - 5000 }] })
    expect(((await handleGetWeek(store, '2026-W41')).body as any).ticks.a.v.done).toBe(true)
  })
  it('rejects bad week', async () => {
    expect((await handleGetWeek(mem(), 'nope')).status).toBe(400)
  })
})
