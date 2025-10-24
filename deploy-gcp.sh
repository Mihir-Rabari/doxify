#!/bin/bash

# Doxify GCP Cloud Run Deployment Script
# This script deploys all microservices to Google Cloud Run

set -e

# Configuration
PROJECT_ID="${GCP_PROJECT_ID}"
REGION="${GCP_REGION:-us-central1}"
MONGODB_URI="${MONGODB_URI}"
JWT_SECRET="${JWT_SECRET}"

# Check if required variables are set
if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: GCP_PROJECT_ID environment variable is not set"
    echo "Usage: GCP_PROJECT_ID=your-project-id ./deploy-gcp.sh"
    exit 1
fi

if [ -z "$MONGODB_URI" ]; then
    echo "⚠️  Warning: MONGODB_URI not set. Using default (set MONGODB_URI for production)"
    MONGODB_URI="mongodb://doxify:doxify123@mongodb:27017/doxify?authSource=admin"
fi

if [ -z "$JWT_SECRET" ]; then
    echo "⚠️  Warning: JWT_SECRET not set. Using default (set JWT_SECRET for production)"
    JWT_SECRET="change-this-secret-in-production"
fi

echo "🚀 Deploying Doxify to Google Cloud Run"
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo ""

# Set the project
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "📦 Enabling required Google Cloud APIs..."
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build all images using Cloud Build
echo "🔨 Building all service images..."
gcloud builds submit --config cloudbuild.yaml .

# Deploy Parser Service (no dependencies)
echo "🚀 Deploying Parser Service..."
gcloud run deploy doxify-parser-service \
  --image gcr.io/$PROJECT_ID/doxify-parser-service \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,PORT=4004" \
  --command="node" \
  --args="services/parser-service/dist/index.js" \
  --max-instances=10 \
  --memory=512Mi

PARSER_URL=$(gcloud run services describe doxify-parser-service --platform managed --region $REGION --format 'value(status.url)')

# Deploy Auth Service
echo "🚀 Deploying Auth Service..."
gcloud run deploy doxify-auth-service \
  --image gcr.io/$PROJECT_ID/doxify-auth-service \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,PORT=4001,MONGODB_URI=$MONGODB_URI,JWT_SECRET=$JWT_SECRET,JWT_EXPIRES_IN=7d" \
  --command="node" \
  --args="services/auth-service/dist/index.js" \
  --max-instances=10 \
  --memory=512Mi

AUTH_URL=$(gcloud run services describe doxify-auth-service --platform managed --region $REGION --format 'value(status.url)')

# Deploy Projects Service
echo "🚀 Deploying Projects Service..."
gcloud run deploy doxify-projects-service \
  --image gcr.io/$PROJECT_ID/doxify-projects-service \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,PORT=4002,MONGODB_URI=$MONGODB_URI" \
  --command="node" \
  --args="services/projects-service/dist/index.js" \
  --max-instances=10 \
  --memory=512Mi

PROJECTS_URL=$(gcloud run services describe doxify-projects-service --platform managed --region $REGION --format 'value(status.url)')

# Deploy Pages Service
echo "🚀 Deploying Pages Service..."
gcloud run deploy doxify-pages-service \
  --image gcr.io/$PROJECT_ID/doxify-pages-service \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,PORT=4003,MONGODB_URI=$MONGODB_URI,PARSER_SERVICE_URL=$PARSER_URL" \
  --command="node" \
  --args="services/pages-service/dist/index.js" \
  --max-instances=10 \
  --memory=512Mi

PAGES_URL=$(gcloud run services describe doxify-pages-service --platform managed --region $REGION --format 'value(status.url)')

# Deploy Theme Service
echo "🚀 Deploying Theme Service..."
gcloud run deploy doxify-theme-service \
  --image gcr.io/$PROJECT_ID/doxify-theme-service \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,PORT=4005,MONGODB_URI=$MONGODB_URI" \
  --command="node" \
  --args="services/theme-service/dist/index.js" \
  --max-instances=10 \
  --memory=512Mi

THEME_URL=$(gcloud run services describe doxify-theme-service --platform managed --region $REGION --format 'value(status.url)')

# Deploy Export Service
echo "🚀 Deploying Export Service..."
gcloud run deploy doxify-export-service \
  --image gcr.io/$PROJECT_ID/doxify-export-service \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,PORT=4006,MONGODB_URI=$MONGODB_URI" \
  --command="node" \
  --args="services/export-service/dist/index.js" \
  --max-instances=10 \
  --memory=512Mi

EXPORT_URL=$(gcloud run services describe doxify-export-service --platform managed --region $REGION --format 'value(status.url)')

# Deploy Viewer Service
echo "🚀 Deploying Viewer Service..."
gcloud run deploy doxify-viewer-service \
  --image gcr.io/$PROJECT_ID/doxify-viewer-service \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,PORT=4007,MONGODB_URI=$MONGODB_URI" \
  --command="node" \
  --args="services/viewer-service/dist/index.js" \
  --max-instances=10 \
  --memory=512Mi

VIEWER_URL=$(gcloud run services describe doxify-viewer-service --platform managed --region $REGION --format 'value(status.url)')

# Deploy MCP Service
echo "🚀 Deploying MCP Service..."
gcloud run deploy doxify-mcp-service \
  --image gcr.io/$PROJECT_ID/doxify-mcp-service \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,PORT=4008,MONGODB_URI=$MONGODB_URI" \
  --command="node" \
  --args="services/mcp-service/dist/index.js" \
  --max-instances=10 \
  --memory=512Mi

MCP_URL=$(gcloud run services describe doxify-mcp-service --platform managed --region $REGION --format 'value(status.url)')

# Deploy API Gateway (with all service URLs)
echo "🚀 Deploying API Gateway..."
gcloud run deploy doxify-api-gateway \
  --image gcr.io/$PROJECT_ID/doxify-api-gateway \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,PORT=4000,AUTH_SERVICE_URL=$AUTH_URL,PROJECTS_SERVICE_URL=$PROJECTS_URL,PAGES_SERVICE_URL=$PAGES_URL,PARSER_SERVICE_URL=$PARSER_URL,THEME_SERVICE_URL=$THEME_URL,EXPORT_SERVICE_URL=$EXPORT_URL,VIEWER_SERVICE_URL=$VIEWER_URL,MCP_SERVICE_URL=$MCP_URL" \
  --command="node" \
  --args="services/api-gateway/dist/index.js" \
  --max-instances=20 \
  --memory=512Mi

API_GATEWAY_URL=$(gcloud run services describe doxify-api-gateway --platform managed --region $REGION --format 'value(status.url)')

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "🌐 Service URLs:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "API Gateway:     $API_GATEWAY_URL"
echo "Auth Service:    $AUTH_URL"
echo "Projects:        $PROJECTS_URL"
echo "Pages:           $PAGES_URL"
echo "Parser:          $PARSER_URL"
echo "Theme:           $THEME_URL"
echo "Export:          $EXPORT_URL"
echo "Viewer:          $VIEWER_URL"
echo "MCP:             $MCP_URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Next Steps:"
echo "1. Set up MongoDB Atlas: https://www.mongodb.com/cloud/atlas"
echo "2. Update MONGODB_URI in each service"
echo "3. Deploy frontend to Cloud Storage + CDN"
echo "4. Configure custom domain (optional)"
echo ""
echo "💡 Update frontend API URL to: $API_GATEWAY_URL"
