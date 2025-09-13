# Use the official Node.js 18 image with OpenSSL support
FROM node:18-slim

# Install OpenSSL to fix Prisma warnings
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --production=false

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# Build the application
RUN pnpm build

# Copy startup script and test server
COPY start-test.sh /app/start.sh
COPY test-server.js /app/test-server.js
RUN chmod +x /app/start.sh

# Expose port (Cloud Run uses PORT environment variable)
EXPOSE 8080

# Set environment variable for production
ENV NODE_ENV=production
ENV PORT=8080

# Start the application
CMD ["/app/start.sh"]
