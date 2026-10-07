import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { createAvatar } from '@dicebear/core'
import * as openPeeps from '@dicebear/open-peeps'
import type { Plugin } from 'vite'
import type { Area, InfoPage } from '../src/shared/types'

const VIRTUAL = 'virtual:roomies-content'
const RESOLVED = '\0' + VIRTUAL

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
}

function readDir(dir: string) {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({ id: f.replace(/\.md$/, ''), ...matter(fs.readFileSync(path.join(dir, f), 'utf8')) }))
}

/** Open Peeps avatars (CC0, Pablo Stanley) made at build time, one per person in config.json.
 *  The seed is the person id: change "avatar" in config.json to get a different face. */
function loadAvatars(root: string): Record<string, string> {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'config.json'), 'utf8')) as {
    people: { id: string; avatar?: string }[]
  }
  return Object.fromEntries(
    config.people.map((p) => [p.id, createAvatar(openPeeps, {
        seed: p.avatar ?? p.id,
        scale: 95,
        // Only friendly faces, no masks.
        face: ['smile', 'smileBig', 'smileTeethGap', 'calm', 'cute', 'cheeky', 'lovingGrin1', 'lovingGrin2', 'eatingHappy', 'smileLOL'],
        maskProbability: 0,
      }).toDataUri()]),
  )
}

export function loadContent(root: string): { areas: Area[]; info: InfoPage[]; avatars: Record<string, string> } {
  const areas: Area[] = readDir(path.join(root, 'content/areas')).map(({ id, data, content }) => {
    const items: string[] = Array.isArray(data.checklist) ? data.checklist.map(String) : []
    const seen = new Set<string>()
    return {
      id,
      name: String(data.name ?? id),
      short: String(data.short ?? data.name ?? id),
      color: data.color ?? 'cream',
      doodle: String(data.doodle ?? 'sparkle'),
      checklist: items.map((text) => {
        let itemId = slugify(text) || 'item'
        while (seen.has(itemId)) itemId += '-2'
        seen.add(itemId)
        return { id: itemId, text }
      }),
      body: content.trim(),
    }
  })
  const info: InfoPage[] = readDir(path.join(root, 'content/info'))
    .map(({ id, data, content }) => ({
      id,
      title: String(data.title ?? id),
      icon: String(data.icon ?? 'info'),
      color: data.color ?? 'cream',
      order: Number(data.order ?? 99),
      body: content.trim(),
    }))
    .sort((a, b) => a.order - b.order)
  return { areas, info, avatars: loadAvatars(root) }
}

/** Turns /content/*.md into a JS module at build time, so content is bundled and works offline. */
export function contentPlugin(): Plugin {
  let root = process.cwd()
  return {
    name: 'roomies-content',
    configResolved(c) {
      root = c.root
    },
    resolveId(id) {
      if (id === VIRTUAL) return RESOLVED
    },
    load(id) {
      if (id !== RESOLVED) return
      const dir = path.join(root, 'content')
      const addWatch = (d: string) => {
        if (!fs.existsSync(d)) return
        for (const f of fs.readdirSync(d)) {
          const p = path.join(d, f)
          if (fs.statSync(p).isDirectory()) addWatch(p)
          else this.addWatchFile(p)
        }
      }
      addWatch(dir)
      this.addWatchFile(path.join(root, 'config.json'))
      return `export default ${JSON.stringify(loadContent(root))}`
    },
    configureServer(server) {
      server.watcher.add(path.join(root, 'content'))
      server.watcher.on('all', (_e, file) => {
        if (!file.includes(`${path.sep}content${path.sep}`)) return
        const mod = server.moduleGraph.getModuleById(RESOLVED)
        if (mod) {
          server.moduleGraph.invalidateModule(mod)
          server.ws.send({ type: 'full-reload' })
        }
      })
    },
  }
}
