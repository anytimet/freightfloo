#!/bin/sh
set -e

echo "=== FreightFloo Startup Script ==="
echo "Current directory: $(pwd)"
echo "Environment variables:"
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "PATH: $PATH"

echo "=== Setting up SQLite database ==="
pnpm prisma db push

echo "=== Starting Next.js application ==="
export PORT=${PORT:-8080}
echo "Final PORT: $PORT"

echo "=== Starting Next.js with: next start -p $PORT ==="
exec npx next start -p $PORT
