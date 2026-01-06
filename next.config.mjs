/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 启用图片优化（Next.js自动优化图片）
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      // 动态支持 Supabase URL（从环境变量读取）
      // 如果 Supabase 暂停，Next.js Image 优化器会失败，SafeImage 组件会回退到原生 img
      ...(process.env.SUPABASE_URL
        ? [
            {
              protocol: 'https',
              hostname: new URL(process.env.SUPABASE_URL).hostname,
            },
          ]
        : []),
      // 也支持硬编码的 Supabase hostname（用于构建时）
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  // 启用压缩
  compress: true,
  // 生产环境优化
  swcMinify: true,
  // 优化字体加载
  optimizeFonts: true,
}

export default nextConfig
