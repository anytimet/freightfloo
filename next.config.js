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
  // Optimize for modern browsers
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Modern browser support
  transpilePackages: [],
  // Bundle analyzer (uncomment to analyze bundle)
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.resolve.fallback = {
  //       ...config.resolve.fallback,
  //       fs: false,
  //     }
  //   }
  //   return config
  // },
}

module.exports = nextConfig
