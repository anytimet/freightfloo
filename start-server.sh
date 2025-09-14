#!/bin/bash

echo "=== Starting FreightFloo with Custom Server ==="
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

# Start the custom server
echo "Starting custom Next.js server..."
exec node server-simple.js
