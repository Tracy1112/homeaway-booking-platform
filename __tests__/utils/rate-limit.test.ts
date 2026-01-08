/**
 * Tests for rate limiting utility
 */

import { rateLimit, getClientIP, RATE_LIMITS } from '@/utils/rate-limit';

describe('rateLimit', () => {
  beforeEach(() => {
    // Clear rate limit store before each test
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should allow requests within limit', () => {
    const identifier = 'test-ip';
    const result = rateLimit(identifier, RATE_LIMITS.STANDARD);

    expect(result.success).toBe(true);
    expect(result.remaining).toBe(RATE_LIMITS.STANDARD.max - 1);
    expect(result.limit).toBe(RATE_LIMITS.STANDARD.max);
  });

  it('should block requests exceeding limit', () => {
    const identifier = 'test-ip-2';
    const limit = { max: 3, window: 60 };

    // Make requests up to the limit
    for (let i = 0; i < limit.max; i++) {
      const result = rateLimit(identifier, limit);
      expect(result.success).toBe(true);
    }

    // Next request should be blocked
    const blockedResult = rateLimit(identifier, limit);
    expect(blockedResult.success).toBe(false);
    expect(blockedResult.remaining).toBe(0);
    expect(blockedResult.retryAfter).toBeDefined();
  });

  it('should reset after window expires', () => {
    const identifier = 'test-ip-3';
    const limit = { max: 2, window: 60 };

    // Exhaust the limit
    rateLimit(identifier, limit);
    rateLimit(identifier, limit);
    const blocked = rateLimit(identifier, limit);
    expect(blocked.success).toBe(false);

    // Fast-forward time past the window
    jest.advanceTimersByTime(61 * 1000);

    // Should be allowed again
    const allowed = rateLimit(identifier, limit);
    expect(allowed.success).toBe(true);
  });

  it('should track different identifiers separately', () => {
    const limit = { max: 2, window: 60 };

    // Exhaust limit for identifier 1
    rateLimit('ip-1', limit);
    rateLimit('ip-1', limit);
    const blocked1 = rateLimit('ip-1', limit);
    expect(blocked1.success).toBe(false);

    // Identifier 2 should still be allowed
    const allowed2 = rateLimit('ip-2', limit);
    expect(allowed2.success).toBe(true);
  });

  it('should include correct rate limit information', () => {
    const identifier = 'test-ip-4';
    const limit = { max: 10, window: 60 };
    const result = rateLimit(identifier, limit);

    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('limit');
    expect(result).toHaveProperty('remaining');
    expect(result).toHaveProperty('reset');
    expect(result.limit).toBe(limit.max);
    expect(result.remaining).toBe(limit.max - 1);
    expect(result.reset).toBeGreaterThan(Date.now());
  });
});

describe('getClientIP', () => {
  it('should extract IP from x-forwarded-for header', () => {
    const request = new Request('http://example.com', {
      headers: {
        'x-forwarded-for': '192.168.1.1, 10.0.0.1',
      },
    });

    const ip = getClientIP(request);
    expect(ip).toBe('192.168.1.1');
  });

  it('should extract IP from x-real-ip header', () => {
    const request = new Request('http://example.com', {
      headers: {
        'x-real-ip': '192.168.1.2',
      },
    });

    const ip = getClientIP(request);
    expect(ip).toBe('192.168.1.2');
  });

  it('should prefer x-forwarded-for over x-real-ip', () => {
    const request = new Request('http://example.com', {
      headers: {
        'x-forwarded-for': '192.168.1.1',
        'x-real-ip': '192.168.1.2',
      },
    });

    const ip = getClientIP(request);
    expect(ip).toBe('192.168.1.1');
  });

  it('should return unknown if no IP headers present', () => {
    const request = new Request('http://example.com');

    const ip = getClientIP(request);
    expect(ip).toBe('unknown');
  });
});

describe('RATE_LIMITS', () => {
  it('should have all required limit presets', () => {
    expect(RATE_LIMITS.STRICT).toBeDefined();
    expect(RATE_LIMITS.STANDARD).toBeDefined();
    expect(RATE_LIMITS.LENIENT).toBeDefined();
    expect(RATE_LIMITS.PAYMENT).toBeDefined();
    expect(RATE_LIMITS.AUTH).toBeDefined();
  });

  it('should have correct structure for each preset', () => {
    Object.values(RATE_LIMITS).forEach((limit) => {
      expect(limit).toHaveProperty('max');
      expect(limit).toHaveProperty('window');
      expect(typeof limit.max).toBe('number');
      expect(typeof limit.window).toBe('number');
      expect(limit.max).toBeGreaterThan(0);
      expect(limit.window).toBeGreaterThan(0);
    });
  });
});

