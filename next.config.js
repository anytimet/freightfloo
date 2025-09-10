/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is enabled by default in Next.js 13+
  // Temporarily disable standalone output for Windows compatibility
  // output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
  // Enable static optimization
  trailingSlash: false,
  // Optimize for production
  swcMinify: true,
  // Enable compression
  compress: true,
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  // Performance optimizations
  poweredByHeader: false,
  generateEtags: false,
}

module.exports = nextConfig
