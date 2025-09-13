/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs']
  },
  // Ensure the app can handle the PORT environment variable
  env: {
    PORT: process.env.PORT || '8080'
  }
}

module.exports = nextConfig