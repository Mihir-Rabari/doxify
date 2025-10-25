# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy all code
COPY services ./services
COPY shared ./shared

# Install dependencies and build each service
RUN cd services/api-gateway && npm install && npm run build
RUN cd services/auth-service && npm install && npm run build
RUN cd services/projects-service && npm install && npm run build
RUN cd services/pages-service && npm install && npm run build
RUN cd services/parser-service && npm install && npm run build
RUN cd services/theme-service && npm install && npm run build
RUN cd services/export-service && npm install && npm run build
RUN cd services/viewer-service && npm install && npm run build
RUN cd services/mcp-service && npm install && npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy built services from builder
COPY --from=builder /app/services ./services
COPY --from=builder /app/shared ./shared

# Expose all service ports
EXPOSE 4000 4001 4002 4003 4004 4005 4006 4007 4008

CMD ["node", "services/api-gateway/dist/index.js"]
