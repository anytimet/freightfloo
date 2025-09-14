#!/bin/sh
set -e

echo "=== Fast FreightFloo Startup v2 ==="
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"

# Set default port
export PORT=${PORT:-8080}
echo "Using PORT: $PORT"

# Start Next.js immediately (database will be created on first use)
echo "Starting Next.js..."
exec npx next start -p $PORT
