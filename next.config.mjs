/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Enable image optimization (Next.js automatic image optimization)
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      // Dynamically support Supabase URL (read from environment variables)
      // If Supabase is paused, Next.js Image optimizer will fail, SafeImage component will fallback to native img
      ...(process.env.SUPABASE_URL
        ? [
            {
              protocol: 'https',
              hostname: new URL(process.env.SUPABASE_URL).hostname,
            },
          ]
        : []),
      // Also support hardcoded Supabase hostname (for build time)
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  // Enable compression
  compress: true,
  // Production optimizations
  swcMinify: true,
  // Optimize font loading
  optimizeFonts: true,
  // Enable instrumentation hook (for Sentry and other monitoring tools)
  experimental: {
    instrumentationHook: true,
  },
}

// Wrap with Sentry if available (optional - only if @sentry/nextjs is installed)
let config = nextConfig

// Try to wrap with Sentry (will fail gracefully if not installed)
// Only attempt if DSN is provided to avoid unnecessary require
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  try {
    const { withSentryConfig } = require('@sentry/nextjs')
    config = withSentryConfig(nextConfig, {
      // Sentry configuration options
      silent: true, // Suppress source map uploading logs during build
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
    })
  } catch (e) {
    // Sentry not installed, use default config
    // Only log in development to avoid build noise
    if (process.env.NODE_ENV === 'development') {
      console.log(
        'Sentry not configured. Install @sentry/nextjs to enable error tracking.'
      )
    }
  }
}

export default config
