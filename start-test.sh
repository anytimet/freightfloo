#!/bin/sh
set -e

echo "=== Test Server Startup ==="
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"

# Set default port
export PORT=${PORT:-8080}
echo "Using PORT: $PORT"

# Start test server
echo "Starting test server..."
exec node test-server.js
