#!/bin/sh
set -e

echo "=== Minimal FreightFloo Startup ==="
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"

# Set default port
export PORT=${PORT:-8080}
echo "Using PORT: $PORT"

# Start Next.js directly
echo "Starting Next.js..."
exec npx next start -p $PORT
