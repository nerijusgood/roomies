import { Redis } from '@upstash/redis'
import type { WeekTicks } from '../src/shared/types'
import type { TickStore } from './logic'

/** Production store for Vercel. Needs KV_REST_API_URL + KV_REST_API_TOKEN (set by the Upstash integration). */
export function redisStore(): TickStore {
  const redis = new Redis({
    url: process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? '',
    token: process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? '',
  })
  const key = (week: string) => `roomies:week:${week}`
  return {
    async getWeek(week) {
      return (await redis.get<WeekTicks>(key(week))) ?? {}
    },
    async saveWeek(week, ticks) {
      // Keep a year of history, then let it expire.
      await redis.set(key(week), ticks, { ex: 60 * 60 * 24 * 400 })
    },
  }
}
