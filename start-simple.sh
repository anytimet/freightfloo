#!/bin/sh
set -e

echo "=== Simple FreightFloo Startup Script ==="
echo "Current directory: $(pwd)"
echo "Environment variables:"
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"

echo "=== Setting up database in background ==="
pnpm prisma db push &

echo "=== Starting Next.js application ==="
export PORT=${PORT:-8080}
echo "Final PORT: $PORT"

echo "=== Starting Next.js with: next start -p $PORT ==="
exec npx next start -p $PORT
