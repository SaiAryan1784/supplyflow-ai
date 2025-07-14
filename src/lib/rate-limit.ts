import { NextRequest } from 'next/server'

interface RateLimitConfig {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Max requests per interval
}

interface RequestInfo {
  count: number
  resetTime: number
}

// In-memory store for rate limiting (use Redis in production)
const requestStore = new Map<string, RequestInfo>()

export function rateLimit(config: RateLimitConfig) {
  return {
    async check(request: NextRequest, limit: number): Promise<void> {
      const ip = request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 'unknown'
      const now = Date.now()
      
      // Clean up old entries
      for (const [key, info] of requestStore.entries()) {
        if (info.resetTime < now) {
          requestStore.delete(key)
        }
      }
      
      const requestInfo = requestStore.get(ip)
      
      if (!requestInfo) {
        // First request from this IP
        requestStore.set(ip, {
          count: 1,
          resetTime: now + config.interval
        })
        return
      }
      
      if (requestInfo.resetTime < now) {
        // Window has expired, reset
        requestInfo.count = 1
        requestInfo.resetTime = now + config.interval
        return
      }
      
      if (requestInfo.count >= limit) {
        throw new Error(`Rate limit exceeded. Try again later.`)
      }
      
      requestInfo.count++
    }
  }
}

// Helper function for API routes
export function createRateLimiter(
  windowMs: number = 60 * 1000 // 1 minute
) {
  return rateLimit({
    interval: windowMs,
    uniqueTokenPerInterval: 500
  })
}