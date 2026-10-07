// Fills data/ticks.json with demo progress for this week and last week.
// Run: yarn demo   (then restart nothing: the local API reads the file on every request)
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const root = path.resolve(import.meta.dirname, '..')
const config = JSON.parse(fs.readFileSync(path.join(root, 'config.json'), 'utf8'))

const slugify = (s) =>
  s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-')
const items = (areaId) => {
  const { data } = matter(fs.readFileSync(path.join(root, 'content/areas', `${areaId}.md`), 'utf8'))
  return (data.checklist ?? []).map((t) => slugify(String(t)))
}

function weekId(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const y = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return `${d.getUTCFullYear()}-W${String(Math.ceil(((d - y) / 86400000 + 1) / 7)).padStart(2, '0')}`
}
const monday = (id) => {
  const [y, w] = id.split('-W').map(Number)
  const j4 = new Date(y, 0, 4)
  const m = new Date(y, 0, 4 - (j4.getDay() || 7) + 1)
  m.setDate(m.getDate() + (w - 1) * 7)
  return m
}
const assignments = (week) => {
  const offset = Math.round((monday(week) - monday(config.startWeek)) / (7 * 86400000))
  const n = config.areas.length
  const out = {}
  config.people.forEach((p, i) => {
    const slot = (((i + offset) % Math.max(n, config.people.length)) + Math.max(n, config.people.length)) % Math.max(n, config.people.length)
    out[p.id] = slot < n ? config.areas[slot] : null
  })
  for (const o of config.overrides.filter((x) => x.week === week)) {
    if (o.swap) [out[o.swap[0]], out[o.swap[1]]] = [out[o.swap[1]], out[o.swap[0]]]
    Object.assign(out, o.assign ?? {})
  }
  return out
}

const now = new Date()
const thisWeek = weekId(now)
const last = new Date(now)
last.setDate(last.getDate() - 7)
const lastWeek = weekId(last)

// share of each person's list that is done: this week / last week
const progress = [[0.4, 1], [1, 1], [0.45, 0.6], [0, 1]]
const all = {}
for (const [week, col] of [[thisWeek, 0], [lastWeek, 1]]) {
  const assign = assignments(week)
  const ticks = {}
  config.people.forEach((p, i) => {
    const list = assign[p.id] ? items(assign[p.id]) : []
    const count = Math.round(list.length * progress[i % progress.length][col])
    const start = week === thisWeek ? Math.min(Date.now() - 3 * 3600_000, monday(week).getTime() + 2 * 86400000 + 10 * 3600_000) : monday(week).getTime() + 5 * 86400000 + 11 * 3600_000
    ticks[p.id] = Object.fromEntries(list.slice(0, count).map((id, k) => [id, { done: true, at: start + k * 9 * 60_000 }]))
  })
  all[week] = ticks
}
fs.mkdirSync(path.join(root, 'data'), { recursive: true })
fs.writeFileSync(path.join(root, 'data/ticks.json'), JSON.stringify(all, null, 2))
console.log(`Demo ticks written for ${lastWeek} and ${thisWeek}`)
