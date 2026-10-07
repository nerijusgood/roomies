import fs from 'node:fs'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Connect, Plugin } from 'vite'
import type { Config } from '../src/shared/types'
import { handleGetWeek, handlePostTicks } from '../server/logic'
import { fileStore } from '../server/file-store'

/** Serves /api/week and /api/tick from `vite dev` and `vite preview`, storing ticks in data/ticks.json.
 *  Lets phones on the same wifi sync for real, without any cloud. */
export function localApiPlugin(): Plugin {
  let root = process.cwd()
  const middleware = (): Connect.NextHandleFunction => {
    const store = fileStore(path.join(root, 'data/ticks.json'))
    const readConfig = () => JSON.parse(fs.readFileSync(path.join(root, 'config.json'), 'utf8')) as Config
    return async (req: IncomingMessage, res: ServerResponse, next) => {
      const url = new URL(req.url ?? '/', 'http://local')
      if (!url.pathname.startsWith('/api/')) return next()
      const send = (status: number, body: unknown) => {
        res.statusCode = status
        res.setHeader('content-type', 'application/json')
        res.setHeader('cache-control', 'no-store')
        res.end(JSON.stringify(body))
      }
      try {
        if (url.pathname === '/api/week' && req.method === 'GET') {
          const r = await handleGetWeek(store, url.searchParams.get('w'))
          return send(r.status, r.body)
        }
        if (url.pathname === '/api/tick' && req.method === 'POST') {
          const chunks: Buffer[] = []
          for await (const c of req) chunks.push(c as Buffer)
          let body: unknown = null
          try {
            body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
          } catch {
            /* handled in logic */
          }
          const r = await handlePostTicks(store, readConfig(), body)
          return send(r.status, r.body)
        }
        send(404, { error: 'Not found' })
      } catch (e) {
        send(500, { error: String(e) })
      }
    }
  }
  return {
    name: 'roomies-local-api',
    configResolved(c) {
      root = c.root
    },
    configureServer(server) {
      server.middlewares.use(middleware())
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware())
    },
  }
}
