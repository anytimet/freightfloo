/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs']
  },
  // Ensure the app can handle the PORT environment variable
  env: {
    PORT: process.env.PORT || '8080'
  },
  // Force dynamic rendering for API routes that use headers
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ]
  },
  // Disable static optimization for API routes
  output: 'standalone'
}

module.exports = nextConfig