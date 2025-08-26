# Pterodactyl-optimized Node.js Backend Dockerfile
FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies for Alpine
RUN apk add --no-cache python3 make g++ && addgroup -g 1001 -S nodejs && adduser -S autocare -u 1001

# Dependencies stage
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts && npm cache clean --force

# Build stage  
FROM base AS build
COPY package*.json ./
RUN npm ci --include=dev
COPY . .
RUN npm run build

# Production stage for Pterodactyl
FROM base AS production
ENV NODE_ENV=production
ENV PORT=3000

# Copy built application
COPY --from=build --chown=autocare:nodejs /app/dist ./dist
COPY --from=build --chown=autocare:nodejs /app/package*.json ./
COPY --from=deps --chown=autocare:nodejs /app/node_modules ./node_modules

# Create required directories
RUN mkdir -p logs uploads temp && \
    chown -R autocare:nodejs logs uploads temp

# Health check for Pterodactyl monitoring
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

USER autocare
EXPOSE 3000

# Pterodactyl startup command
CMD ["npm", "run", "start:prod"]
