#!/bin/sh
set -e

echo "=== FreightFloo Startup ==="
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"

# Set default port
export PORT=${PORT:-8080}
echo "Using PORT: $PORT"

# Setup database
echo "Setting up database..."
pnpm prisma db push

# Start Next.js
echo "Starting Next.js..."
exec npx next start -p $PORT
