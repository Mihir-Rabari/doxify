# Doxify GCP Cloud Run Deployment Script (PowerShell)
# This script deploys all microservices to Google Cloud Run

$ErrorActionPreference = "Stop"

# Configuration
$PROJECT_ID = $env:GCP_PROJECT_ID
$REGION = if ($env:GCP_REGION) { $env:GCP_REGION } else { "us-central1" }
$MONGODB_URI = $env:MONGODB_URI
$JWT_SECRET = $env:JWT_SECRET

# Check if required variables are set
if (-not $PROJECT_ID) {
    Write-Host "❌ Error: GCP_PROJECT_ID environment variable is not set" -ForegroundColor Red
    Write-Host "Usage: `$env:GCP_PROJECT_ID='your-project-id'; .\deploy-gcp.ps1"
    exit 1
}

if (-not $MONGODB_URI) {
    Write-Host "⚠️  Warning: MONGODB_URI not set. Using default" -ForegroundColor Yellow
    $MONGODB_URI = "mongodb://doxify:doxify123@mongodb:27017/doxify?authSource=admin"
}

if (-not $JWT_SECRET) {
    Write-Host "⚠️  Warning: JWT_SECRET not set. Using default" -ForegroundColor Yellow
    $JWT_SECRET = "change-this-secret-in-production"
}

Write-Host "🚀 Deploying Doxify to Google Cloud Run" -ForegroundColor Cyan
Write-Host "Project: $PROJECT_ID"
Write-Host "Region: $REGION"
Write-Host ""

# Set the project
gcloud config set project $PROJECT_ID

# Enable required APIs
Write-Host "📦 Enabling required Google Cloud APIs..." -ForegroundColor Yellow
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build all images using Cloud Build
Write-Host "🔨 Building all service images..." -ForegroundColor Yellow
gcloud builds submit --config cloudbuild.yaml .

# Deploy services
$services = @(
    @{Name="parser"; Port=4004; Deps=""},
    @{Name="auth"; Port=4001; Deps="MONGODB_URI=$MONGODB_URI,JWT_SECRET=$JWT_SECRET,JWT_EXPIRES_IN=7d"},
    @{Name="projects"; Port=4002; Deps="MONGODB_URI=$MONGODB_URI"},
    @{Name="theme"; Port=4005; Deps="MONGODB_URI=$MONGODB_URI"},
    @{Name="export"; Port=4006; Deps="MONGODB_URI=$MONGODB_URI"},
    @{Name="viewer"; Port=4007; Deps="MONGODB_URI=$MONGODB_URI"},
    @{Name="mcp"; Port=4008; Deps="MONGODB_URI=$MONGODB_URI"}
)

$serviceUrls = @{}

foreach ($service in $services) {
    Write-Host "🚀 Deploying $($service.Name) Service..." -ForegroundColor Cyan
    
    $envVars = "NODE_ENV=production,PORT=$($service.Port)"
    if ($service.Deps) {
        $envVars += "," + $service.Deps
    }
    
    gcloud run deploy "doxify-$($service.Name)-service" `
        --image "gcr.io/$PROJECT_ID/doxify-$($service.Name)-service" `
        --platform managed `
        --region $REGION `
        --allow-unauthenticated `
        --set-env-vars $envVars `
        --command="node" `
        --args="services/$($service.Name)-service/dist/index.js" `
        --max-instances=10 `
        --memory=512Mi
    
    $url = gcloud run services describe "doxify-$($service.Name)-service" --platform managed --region $REGION --format 'value(status.url)'
    $serviceUrls[$service.Name] = $url
}

# Deploy Pages Service (needs parser URL)
Write-Host "🚀 Deploying Pages Service..." -ForegroundColor Cyan
gcloud run deploy doxify-pages-service `
    --image "gcr.io/$PROJECT_ID/doxify-pages-service" `
    --platform managed `
    --region $REGION `
    --allow-unauthenticated `
    --set-env-vars "NODE_ENV=production,PORT=4003,MONGODB_URI=$MONGODB_URI,PARSER_SERVICE_URL=$($serviceUrls.parser)" `
    --command="node" `
    --args="services/pages-service/dist/index.js" `
    --max-instances=10 `
    --memory=512Mi

$serviceUrls.pages = gcloud run services describe doxify-pages-service --platform managed --region $REGION --format 'value(status.url)'

# Deploy API Gateway (with all service URLs)
Write-Host "🚀 Deploying API Gateway..." -ForegroundColor Cyan
gcloud run deploy doxify-api-gateway `
    --image "gcr.io/$PROJECT_ID/doxify-api-gateway" `
    --platform managed `
    --region $REGION `
    --allow-unauthenticated `
    --set-env-vars "NODE_ENV=production,PORT=4000,AUTH_SERVICE_URL=$($serviceUrls.auth),PROJECTS_SERVICE_URL=$($serviceUrls.projects),PAGES_SERVICE_URL=$($serviceUrls.pages),PARSER_SERVICE_URL=$($serviceUrls.parser),THEME_SERVICE_URL=$($serviceUrls.theme),EXPORT_SERVICE_URL=$($serviceUrls.export),VIEWER_SERVICE_URL=$($serviceUrls.viewer),MCP_SERVICE_URL=$($serviceUrls.mcp)" `
    --command="node" `
    --args="services/api-gateway/dist/index.js" `
    --max-instances=20 `
    --memory=512Mi

$apiUrl = gcloud run services describe doxify-api-gateway --platform managed --region $REGION --format 'value(status.url)'

Write-Host ""
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Service URLs:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host "API Gateway:     $apiUrl"
foreach ($key in $serviceUrls.Keys) {
    Write-Host "${key}:     $($serviceUrls[$key])"
}
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Set up MongoDB Atlas: https://www.mongodb.com/cloud/atlas"
Write-Host "2. Deploy frontend to Cloud Storage + CDN"
Write-Host "3. Update frontend API URL to: $apiUrl"
