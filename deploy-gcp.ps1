# Doxify GCP Cloud Run Deployment Script (PowerShell)
# This script deploys all microservices to Google Cloud Run

$ErrorActionPreference = "Stop"

# Configuration
$PROJECT_ID = if ($env:GCP_PROJECT_ID) { $env:GCP_PROJECT_ID } else { "doxify-prod" }
$REGION = if ($env:GCP_REGION) { $env:GCP_REGION } else { "asia-south1" }
$JWT_SECRET = $env:JWT_SECRET

# Validate project ID
if (-not $PROJECT_ID) {
    Write-Host "[ERROR] PROJECT_ID could not be determined" -ForegroundColor Red
    exit 1
}

if (-not $JWT_SECRET) {
    Write-Host "[WARNING] JWT_SECRET not set. Using default" -ForegroundColor Yellow
    $JWT_SECRET = "change-this-secret-in-production"
}

Write-Host "Deploying Doxify to Google Cloud Run + Firestore" -ForegroundColor Cyan
Write-Host "Project: $PROJECT_ID"
Write-Host "Region: $REGION"
Write-Host "Database: Firestore (Native GCP)"
Write-Host ""

# Set the project
gcloud config set project $PROJECT_ID

# Enable required APIs
Write-Host "Enabling required Google Cloud APIs..." -ForegroundColor Yellow
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable firestore.googleapis.com

# Build all images using Cloud Build
Write-Host "Building all service images..." -ForegroundColor Yellow
gcloud builds submit --config cloudbuild.yaml .

# Deploy services
$services = @(
    @{Name="parser"; Port=4004; Deps=""},
    @{Name="auth"; Port=4001; Deps="GCP_PROJECT_ID=$PROJECT_ID,JWT_SECRET=$JWT_SECRET,JWT_EXPIRES_IN=7d"},
    @{Name="projects"; Port=4002; Deps="GCP_PROJECT_ID=$PROJECT_ID"},
    @{Name="theme"; Port=4005; Deps="GCP_PROJECT_ID=$PROJECT_ID"},
    @{Name="export"; Port=4006; Deps="GCP_PROJECT_ID=$PROJECT_ID"},
    @{Name="viewer"; Port=4007; Deps="GCP_PROJECT_ID=$PROJECT_ID"},
    @{Name="mcp"; Port=4008; Deps="GCP_PROJECT_ID=$PROJECT_ID"}
)

$serviceUrls = @{}

foreach ($service in $services) {
    Write-Host "Deploying $($service.Name) Service..." -ForegroundColor Cyan
    
    $envVars = "NODE_ENV=production"
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
Write-Host "Deploying Pages Service..." -ForegroundColor Cyan
gcloud run deploy doxify-pages-service `
    --image "gcr.io/$PROJECT_ID/doxify-pages-service" `
    --platform managed `
    --region $REGION `
    --allow-unauthenticated `
    --set-env-vars "NODE_ENV=production,GCP_PROJECT_ID=$PROJECT_ID,PARSER_SERVICE_URL=$($serviceUrls.parser)" `
    --command="node" `
    --args="services/pages-service/dist/index.js" `
    --max-instances=10 `
    --memory=512Mi

$serviceUrls.pages = gcloud run services describe doxify-pages-service --platform managed --region $REGION --format 'value(status.url)'

# Deploy API Gateway (with all service URLs)
Write-Host "Deploying API Gateway..." -ForegroundColor Cyan
gcloud run deploy doxify-api-gateway `
    --image "gcr.io/$PROJECT_ID/doxify-api-gateway" `
    --platform managed `
    --region $REGION `
    --allow-unauthenticated `
    --set-env-vars "NODE_ENV=production,AUTH_SERVICE_URL=$($serviceUrls.auth),PROJECTS_SERVICE_URL=$($serviceUrls.projects),PAGES_SERVICE_URL=$($serviceUrls.pages),PARSER_SERVICE_URL=$($serviceUrls.parser),THEME_SERVICE_URL=$($serviceUrls.theme),EXPORT_SERVICE_URL=$($serviceUrls.export),VIEWER_SERVICE_URL=$($serviceUrls.viewer),MCP_SERVICE_URL=$($serviceUrls.mcp)" `
    --command="node" `
    --args="services/api-gateway/dist/index.js" `
    --max-instances=20 `
    --memory=512Mi

$apiUrl = gcloud run services describe doxify-api-gateway --platform managed --region $REGION --format 'value(status.url)'

Write-Host ""
Write-Host "[SUCCESS] Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Service URLs:" -ForegroundColor Cyan
Write-Host "==========================================="
Write-Host "API Gateway:     $apiUrl"
foreach ($key in $serviceUrls.Keys) {
    Write-Host "${key}:     $($serviceUrls[$key])"
}
Write-Host "==========================================="
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Deploy frontend to Cloud Storage + CDN"
Write-Host "2. Update frontend API URL to: $apiUrl"
Write-Host "3. Configure Firestore security rules (optional)"
Write-Host "4. Set up monitoring and alerts"
