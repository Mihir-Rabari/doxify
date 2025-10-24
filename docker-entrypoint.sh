#!/bin/sh
set -e

# Extract service name from command (e.g., "node services/auth-service/index.js" -> "auth-service")
SERVICE_PATH=$(echo "$@" | grep -oP 'services/\K[^/]+')

if [ -n "$SERVICE_PATH" ]; then
    SERVICE_DIR="/app/services/$SERVICE_PATH"
    
    echo "Installing dependencies for $SERVICE_PATH..."
    cd "$SERVICE_DIR"
    
    if [ -f "package.json" ]; then
        npm install --production --silent
        echo "Dependencies installed for $SERVICE_PATH"
    fi
    
    cd /app
fi

# Execute the original command
exec "$@"
