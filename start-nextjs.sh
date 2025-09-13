#!/bin/sh
set -e

echo "=== Next.js Startup Script ==="
echo "Current directory: $(pwd)"
echo "Environment variables:"
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"

# Set default port if not provided
export PORT=${PORT:-8080}
echo "Using PORT: $PORT"

echo "=== Starting Next.js application ==="
# Use the standard Next.js start command
exec node server.js
