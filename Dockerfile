# Production image for Node services
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy all code
COPY services ./services
COPY shared ./shared
COPY docker-entrypoint.sh /usr/local/bin/

# Make entrypoint executable
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose all service ports
EXPOSE 4000 4001 4002 4003 4004 4005 4006 4007 4008

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "services/api-gateway/index.js"]
