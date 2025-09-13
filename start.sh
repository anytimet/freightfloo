#!/bin/sh
set -e

echo "Starting FreightFloo application..."

# For SQLite, we just need to ensure the database exists
echo "Setting up SQLite database..."
pnpm prisma db push

# Start the application on the port specified by Cloud Run
echo "Starting Next.js application on port ${PORT:-8080}..."
export PORT=${PORT:-8080}
exec pnpm run start:custom
