#!/bin/sh
set -e

echo "Starting FreightFloo application..."

# For SQLite, we just need to ensure the database exists
echo "Setting up SQLite database..."
pnpm prisma db push

# Start the application
echo "Starting Next.js application..."
exec pnpm start
