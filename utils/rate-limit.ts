/**
 * Rate Limiting Utility
 * 
 * Implements in-memory rate limiting for API routes and Server Actions
 * For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitStore {
  count: number;
  resetTime: number;
}

// In-memory store (use Redis in production for distributed systems)
const rateLimitStore = new Map<string, RateLimitStore>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  rateLimitStore.forEach((value, key) => {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitOptions {
  /**
   * Maximum number of requests allowed
   */
  max: number;
  /**
   * Time window in seconds
   */
  window: number;
  /**
   * Custom identifier (defaults to IP address)
   */
  identifier?: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

/**
 * Rate limit check
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param options - Rate limit options
 * @returns Rate limit result
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const { max, window } = options;
  const now = Date.now();
  const windowMs = window * 1000;
  const key = `${identifier}:${options.identifier || 'default'}`;

  const record = rateLimitStore.get(key);

  if (!record || record.resetTime < now) {
    // Create new record or reset expired record
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });

    return {
      success: true,
      limit: max,
      remaining: max - 1,
      reset: now + windowMs,
    };
  }

  // Increment count
  record.count += 1;

  if (record.count > max) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return {
      success: false,
      limit: max,
      remaining: 0,
      reset: record.resetTime,
      retryAfter,
    };
  }

  return {
    success: true,
    limit: max,
    remaining: max - record.count,
    reset: record.resetTime,
  };
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: Request): string {
  // Try various headers (for proxies, load balancers, etc.)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback (in production, this should always be set by the proxy)
  return 'unknown';
}

/**
 * Predefined rate limit configurations
 */
export const RATE_LIMITS = {
  // Strict limits for sensitive operations
  STRICT: {
    max: 5,
    window: 60, // 5 requests per minute
  },
  // Standard API limits
  STANDARD: {
    max: 100,
    window: 60, // 100 requests per minute
  },
  // Lenient limits for public endpoints
  LENIENT: {
    max: 200,
    window: 60, // 200 requests per minute
  },
  // Payment endpoints - very strict
  PAYMENT: {
    max: 10,
    window: 60, // 10 requests per minute
  },
  // Authentication endpoints
  AUTH: {
    max: 5,
    window: 60, // 5 requests per minute
  },
} as const;

