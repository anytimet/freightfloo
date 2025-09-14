#!/bin/sh

echo "=== FreightFloo Debug Startup ==="
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"

# Set default port
export PORT=${PORT:-8080}
echo "Using PORT: $PORT"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "WARNING: DATABASE_URL not set, using fallback"
  export DATABASE_URL="file:./dev.db"
fi

echo "DATABASE_URL: $DATABASE_URL"

# Check if .next directory exists
if [ ! -d ".next" ]; then
  echo "ERROR: .next directory not found"
  echo "Available files:"
  ls -la
  exit 1
fi

echo ".next directory exists"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "ERROR: node_modules directory not found"
  exit 1
fi

echo "node_modules directory exists"

# Try to start Next.js with verbose output
echo "Starting Next.js with debug output..."
exec npx next start -p $PORT --hostname 0.0.0.0
