/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is enabled by default in Next.js 13+
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
  // Enable static optimization
  trailingSlash: false,
  // Optimize for production
  swcMinify: true,
}

module.exports = nextConfig
