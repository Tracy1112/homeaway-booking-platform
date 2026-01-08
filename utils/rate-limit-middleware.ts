/**
 * Rate Limit Middleware Helper
 * 
 * Helper function to apply rate limiting to API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIP, RATE_LIMITS, type RateLimitOptions } from './rate-limit';

/**
 * Rate limit middleware wrapper
 * Returns a response if rate limit is exceeded, null otherwise
 */
export function withRateLimit(
  request: NextRequest,
  options: RateLimitOptions
): NextResponse | null {
  const clientIP = getClientIP(request);
  const result = rateLimit(clientIP, options);

  if (!result.success) {
    return NextResponse.json(
      {
        error: {
          message: 'Too many requests. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED',
        },
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(result.limit),
          'X-RateLimit-Remaining': String(result.remaining),
          'X-RateLimit-Reset': String(result.reset),
          'Retry-After': String(result.retryAfter || 60),
        },
      }
    );
  }

  return null;
}

/**
 * Create rate-limited API handler
 */
export function createRateLimitedHandler(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: RateLimitOptions
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const rateLimitResponse = withRateLimit(req, options);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const response = await handler(req);
    
    // Add rate limit headers to successful responses
    const clientIP = getClientIP(req);
    const result = rateLimit(clientIP, options);
    response.headers.set('X-RateLimit-Limit', String(result.limit));
    response.headers.set('X-RateLimit-Remaining', String(result.remaining));
    response.headers.set('X-RateLimit-Reset', String(result.reset));
    
    return response;
  };
}

/**
 * Export rate limit presets
 */
export { RATE_LIMITS };

