// Vercel function: POST /api/tick  { person, pin, changes: [{ week, item, done, at }] }  (not deployed yet)
import config from '../config.json'
import type { Config } from '../src/shared/types'
import { handlePostTicks } from '../server/logic'
import { redisStore } from '../server/redis-store'

export async function POST(request: Request) {
  let body: unknown = null
  try {
    body = await request.json()
  } catch {
    /* handled below */
  }
  const res = await handlePostTicks(redisStore(), config as Config, body)
  return Response.json(res.body, { status: res.status })
}
