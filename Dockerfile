# Multi-stage build for Doxify backend services (no frontend)
FROM node:18-alpine AS base

# -------- Services build & runtime --------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy code
COPY services ./services
COPY shared ./shared

# Build shared types
WORKDIR /app/shared/types
RUN npm install && npm run build && npm prune --production

# Build each service (install, build, prune dev deps)
WORKDIR /app/services/api-gateway
RUN npm install && npm run build && npm prune --production

WORKDIR /app/services/auth-service
RUN npm install && npm run build && npm prune --production

WORKDIR /app/services/projects-service
RUN npm install && npm run build && npm prune --production

WORKDIR /app/services/pages-service
RUN npm install && npm run build && npm prune --production

WORKDIR /app/services/parser-service
RUN npm install && npm run build && npm prune --production

WORKDIR /app/services/theme-service
RUN npm install && npm run build && npm prune --production

WORKDIR /app/services/export-service
RUN npm install && npm run build && npm prune --production

WORKDIR /app/services/viewer-service
RUN npm install && npm run build && npm prune --production

WORKDIR /app/services/mcp-service
RUN npm install && npm run build && npm prune --production

# Expose all service ports
EXPOSE 4000 4001 4002 4003 4004 4005 4006 4007 4008

# Default command (compose overrides per service)
CMD ["node", "services/api-gateway/dist/index.js"]
