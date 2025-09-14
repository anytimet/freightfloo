#!/bin/sh

echo "=== FreightFloo Startup ==="
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

# Setup database (non-blocking, but don't fail if it doesn't work)
echo "Setting up database..."
if ! pnpm prisma db push; then
  echo "Database setup failed, but continuing with startup..."
fi

# Verify Next.js build exists
if [ ! -d ".next" ]; then
  echo "ERROR: Next.js build not found. Running build..."
  if ! pnpm build; then
    echo "ERROR: Build failed"
    exit 1
  fi
fi

# Start Next.js
echo "Starting Next.js on port $PORT..."
exec npx next start -p $PORT --hostname 0.0.0.0
