#!/bin/sh
set -e

echo "Starting FreightFloo application..."

# Run database migrations
echo "Running database migrations..."
pnpm prisma migrate deploy

# Start the application
echo "Starting Next.js application..."
exec pnpm start
