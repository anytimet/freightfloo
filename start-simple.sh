#!/bin/bash

echo "=== Simple FreightFloo Startup ==="
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"

# Set default port
export PORT=${PORT:-8080}
echo "Using PORT: $PORT"

# Set fallback DATABASE_URL if not provided
if [ -z "$DATABASE_URL" ]; then
  echo "WARNING: DATABASE_URL not set, using SQLite fallback"
  export DATABASE_URL="file:./dev.db"
fi

echo "DATABASE_URL: $DATABASE_URL"

# List directory contents for debugging
echo "Directory contents:"
ls -la

# Check if .next exists
if [ ! -d ".next" ]; then
  echo "ERROR: .next directory not found!"
  echo "Running build..."
  npm run build
fi

# Start the server
echo "Starting Next.js server..."
node_modules/.bin/next start -p $PORT --hostname 0.0.0.0