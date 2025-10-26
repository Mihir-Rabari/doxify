# Multi-stage build for Doxify services and frontend
FROM node:18-alpine AS base

# -------- Frontend build --------
FROM base AS frontend-builder
WORKDIR /app/apps/web
COPY apps/web/package*.json ./
RUN npm ci
COPY apps/web .
RUN npm run build

FROM base AS frontend-runner
WORKDIR /app/apps/web
ENV NODE_ENV=production
# Use dev deps for vite preview; alternatively use a static server
COPY --from=frontend-builder /app/apps/web/node_modules ./node_modules
COPY --from=frontend-builder /app/apps/web/dist ./dist
COPY --from=frontend-builder /app/apps/web/package*.json ./
EXPOSE 3000
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]

# -------- Services build & runtime --------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy code
COPY services ./services
COPY shared ./shared

# Build shared types
WORKDIR /app/shared/types
RUN npm ci && npm run build && npm ci --omit=dev

# Build each service (install, build, prune dev deps)
WORKDIR /app/services/api-gateway
RUN npm ci && npm run build && npm ci --omit=dev

WORKDIR /app/services/auth-service
RUN npm ci && npm run build && npm ci --omit=dev

WORKDIR /app/services/projects-service
RUN npm ci && npm run build && npm ci --omit=dev

WORKDIR /app/services/pages-service
RUN npm ci && npm run build && npm ci --omit=dev

WORKDIR /app/services/parser-service
RUN npm ci && npm run build && npm ci --omit=dev

WORKDIR /app/services/theme-service
RUN npm ci && npm run build && npm ci --omit=dev

WORKDIR /app/services/export-service
RUN npm ci && npm run build && npm ci --omit=dev

WORKDIR /app/services/viewer-service
RUN npm ci && npm run build && npm ci --omit=dev

WORKDIR /app/services/mcp-service
RUN npm ci && npm run build && npm ci --omit=dev

# Expose all service ports
EXPOSE 4000 4001 4002 4003 4004 4005 4006 4007 4008

# Default command (compose overrides per service)
CMD ["node", "services/api-gateway/dist/index.js"]
