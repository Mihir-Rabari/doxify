#!/bin/sh
set -e

# Extract service name from command (e.g., "node services/auth-service/dist/index.js" -> "auth-service")
SERVICE_PATH=$(echo "$@" | sed -n 's/.*services\/\([^\/]*\).*/\1/p')

if [ -n "$SERVICE_PATH" ]; then
    SERVICE_DIR="/app/services/$SERVICE_PATH"
    
    echo "Installing dependencies for $SERVICE_PATH..."
    cd "$SERVICE_DIR"
    
    if [ -f "package.json" ]; then
        npm install --silent
        echo "Dependencies installed for $SERVICE_PATH"
        
        # Build TypeScript if tsconfig.json exists
        if [ -f "tsconfig.json" ]; then
            echo "Building TypeScript for $SERVICE_PATH..."
            npm run build
            echo "Build complete for $SERVICE_PATH"
        fi
    fi
    
    cd /app
fi

# Execute the original command
exec "$@"
