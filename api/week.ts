// Vercel function: GET /api/week?w=2026-W41  (not deployed yet)
import { handleGetWeek } from '../server/logic'
import { redisStore } from '../server/redis-store'

export async function GET(request: Request) {
  const week = new URL(request.url).searchParams.get('w')
  const res = await handleGetWeek(redisStore(), week)
  return Response.json(res.body, { status: res.status, headers: { 'cache-control': 'no-store' } })
}
