import { NextResponse } from "next/server";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Each distinct user adds an entry, so the map is unbounded without this.
// Sweeping on growth keeps it proportional to active users, not lifetime users.
const MAX_BUCKETS = 10_000;

function sweep(now: number) {
  if (buckets.size < MAX_BUCKETS) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Fixed-window counter. In-memory, so it is per server instance: on a
 * multi-instance deployment it bounds abuse per instance rather than globally.
 * That is still the difference between "a user can loop this endpoint" and
 * "a user can loop it N times per instance", which is what protects the
 * per-token AI bill. A shared store (Redis/Upstash) is the upgrade path.
 */
export function consume(
  scope: string,
  identity: string,
  max: number,
  windowMs = 60_000
): { ok: true } | { ok: false; retryAfterMs: number } {
  const now = Date.now();
  const key = `${scope}:${identity}`;

  sweep(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (bucket.count >= max) {
    return { ok: false, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { ok: true };
}

/** 429 response for a failed `consume()`, with a Retry-After the client can honour. */
export function tooManyRequests(retryAfterMs: number) {
  const seconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
  return NextResponse.json(
    {
      data: null,
      error: {
        code: "rate_limited",
        message: `Too many requests. Try again in ${seconds}s.`,
      },
    },
    { status: 429, headers: { "Retry-After": String(seconds) } }
  );
}
