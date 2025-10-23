# Multi-stage build for Doxify services
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Build frontend
FROM base AS frontend-builder
WORKDIR /app
COPY apps/web ./apps/web
WORKDIR /app/apps/web
RUN npm ci
RUN npm run build

# Production image - Node services
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy service code
COPY services ./services
COPY shared ./shared

# Expose all service ports
EXPOSE 4000 4001 4002 4003 4004 4005 4006 4007 4008

# Default command (can be overridden in docker-compose)
CMD ["node", "services/api-gateway/index.js"]
