# Multi-stage build for Doxify backend services (no frontend)
FROM node:18-alpine AS base

# -------- Build stage --------
FROM base AS builder
WORKDIR /app

# Copy code
COPY services ./services
COPY shared ./shared

# Build shared types
WORKDIR /app/shared/types
RUN npm install --include=dev
RUN npm run build

# Build each service
WORKDIR /app/services/api-gateway
RUN npm install --include=dev && npm run build

WORKDIR /app/services/auth-service
RUN npm install --include=dev && npm run build

WORKDIR /app/services/projects-service
RUN npm install --include=dev && npm run build

WORKDIR /app/services/pages-service
RUN npm install --include=dev && npm run build

WORKDIR /app/services/parser-service
RUN npm install --include=dev && npm run build

WORKDIR /app/services/theme-service
RUN npm install --include=dev && npm run build

WORKDIR /app/services/export-service
RUN npm install --include=dev && npm run build

WORKDIR /app/services/viewer-service
RUN npm install --include=dev && npm run build

WORKDIR /app/services/mcp-service
RUN npm install --include=dev && npm run build

# -------- Production stage --------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built code and install only production deps
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/services ./services

# Install production dependencies only
WORKDIR /app/shared/types
RUN npm install --omit=dev

WORKDIR /app/services/api-gateway
RUN npm install --omit=dev

WORKDIR /app/services/auth-service
RUN npm install --omit=dev

WORKDIR /app/services/projects-service
RUN npm install --omit=dev

WORKDIR /app/services/pages-service
RUN npm install --omit=dev

WORKDIR /app/services/parser-service
RUN npm install --omit=dev

WORKDIR /app/services/theme-service
RUN npm install --omit=dev

WORKDIR /app/services/export-service
RUN npm install --omit=dev

WORKDIR /app/services/viewer-service
RUN npm install --omit=dev

WORKDIR /app/services/mcp-service
RUN npm install --omit=dev

# Expose all service ports
EXPOSE 4000 4001 4002 4003 4004 4005 4006 4007 4008

# Default command (compose overrides per service)
CMD ["node", "services/api-gateway/dist/index.js"]
