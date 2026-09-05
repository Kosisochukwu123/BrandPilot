// src/lib/rate-limit.ts
// Upstash Redis-backed rate limiting. Applied per-user (not per-IP) on
// expensive endpoints — AI generation and website scraping are the two
// that cost real money per call, so they're the two that need a hard
// ceiling independent of the monthly plan quota (quota stops abuse over
// a month; this stops someone hammering the endpoint in a 10-second burst).
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { logger } from "@/lib/logger";
// import type { Ratelimit } from "@upstash/ratelimit";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function safeRateLimit(limiter: Ratelimit, key: string): Promise<{ success: boolean }> {
  try {
    return await limiter.limit(key);
  } catch (err) {
    logger.error("Rate limiter unreachable, allowing request through", {
      error: err instanceof Error ? err.message : String(err),
    });
    return { success: true };
  }
}

export const generationRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 generation calls per minute per user
  prefix: "ratelimit:generate",
});

export const analysisRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "5 m"), // website scraping is the heaviest call
  prefix: "ratelimit:analyze",
});

export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 m"), // login/register brute-force guard
  prefix: "ratelimit:auth",
});