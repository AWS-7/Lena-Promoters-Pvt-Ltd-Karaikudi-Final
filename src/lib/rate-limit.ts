interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests = new Map<string, RateLimitEntry>();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs = 60000, maxRequests = 10) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isAllowed(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry || now > entry.resetTime) {
      // New window
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + this.windowMs,
      };
      this.requests.set(identifier, newEntry);
      return { allowed: true, remaining: this.maxRequests - 1, resetTime: newEntry.resetTime };
    }

    if (entry.count >= this.maxRequests) {
      return { allowed: false, remaining: 0, resetTime: entry.resetTime };
    }

    entry.count++;
    return { allowed: true, remaining: this.maxRequests - entry.count, resetTime: entry.resetTime };
  }

  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

// Global rate limiters
export const apiRateLimiter = new RateLimiter(60000, 30); // 30 requests per minute for API
export const loginRateLimiter = new RateLimiter(300000, 5); // 5 login attempts per 5 minutes
export const uploadRateLimiter = new RateLimiter(60000, 20); // 20 uploads per minute

// Cleanup every 10 minutes
setInterval(() => {
  apiRateLimiter.cleanup();
  loginRateLimiter.cleanup();
  uploadRateLimiter.cleanup();
}, 600000);

export function getRateLimitHeaders(remaining: number, resetTime: number) {
  return {
    "X-RateLimit-Limit": "30",
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": new Date(resetTime).toISOString(),
  };
}
