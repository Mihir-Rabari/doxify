#!/usr/bin/env pwsh
# Doxify Frontend Deployment Script
# Deploy React/Vite app to Cloud Storage + Cloud CDN

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Deploying Doxify Frontend to GCS + CDN" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Configuration
$PROJECT_ID = "doxify-prod"
$BUCKET_NAME = "doxify-prod-web"
$APP_DIR = "apps/web"
$API_URL = "https://doxify-api-gateway-wqgm3vw2ta-el.a.run.app"

Write-Host "Project: $PROJECT_ID" -ForegroundColor Yellow
Write-Host "Bucket: $BUCKET_NAME" -ForegroundColor Yellow
Write-Host "API URL: $API_URL`n" -ForegroundColor Yellow

# Set GCP project
Write-Host "Setting GCP project..." -ForegroundColor Cyan
gcloud config set project $PROJECT_ID

# Create bucket if it doesn't exist
Write-Host "Checking/Creating storage bucket..." -ForegroundColor Cyan
$bucketCheck = gcloud storage buckets describe gs://$BUCKET_NAME 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Creating new bucket..." -ForegroundColor Yellow
    gcloud storage buckets create gs://$BUCKET_NAME --project=$PROJECT_ID --location=asia-south1 --uniform-bucket-level-access
    
    # Make bucket public for website hosting
    gcloud storage buckets add-iam-policy-binding gs://$BUCKET_NAME --member=allUsers --role=roles/storage.objectViewer
    
    # Set website configuration
    gcloud storage buckets update gs://$BUCKET_NAME --web-main-page-suffix=index.html --web-error-page=index.html
    
    Write-Host "Bucket created and configured!" -ForegroundColor Green
} else {
    Write-Host "Bucket already exists" -ForegroundColor Green
}

# Navigate to web app directory
Push-Location $APP_DIR

try {
    # Install dependencies if needed
    if (-not (Test-Path "node_modules")) {
        Write-Host "`nInstalling dependencies..." -ForegroundColor Cyan
        npm install
    }

    # Build the application
    Write-Host "`nBuilding React application..." -ForegroundColor Cyan
    $env:VITE_API_URL = $API_URL
    $env:VITE_APP_NAME = "Doxify"
    npm run build

    if ($LASTEXITCODE -ne 0) {
        throw "Build failed"
    }

    Write-Host "`nBuild completed successfully!" -ForegroundColor Green

} finally {
    Pop-Location
}

# Upload to Cloud Storage
Write-Host "`nUploading to Cloud Storage..." -ForegroundColor Cyan
gcloud storage rsync $APP_DIR/dist gs://$BUCKET_NAME --recursive --delete-unmatched-destination-objects

# Set cache headers for static assets
Write-Host "Setting cache headers for static assets..." -ForegroundColor Cyan
gcloud storage objects update gs://$BUCKET_NAME/assets/** --cache-control="public, max-age=31536000" --recursive 2>$null

# Set cache headers for HTML
Write-Host "Setting cache headers for HTML..." -ForegroundColor Cyan
gcloud storage objects update gs://$BUCKET_NAME/index.html --cache-control="public, max-age=3600" 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "[SUCCESS] Frontend Deployed!" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Green
    
    Write-Host "Your app is accessible at:" -ForegroundColor Yellow
    Write-Host "https://storage.googleapis.com/$BUCKET_NAME/index.html" -ForegroundColor Cyan
    Write-Host "`nDirect bucket URL:" -ForegroundColor Yellow
    Write-Host "https://$BUCKET_NAME.storage.googleapis.com/index.html" -ForegroundColor Cyan
    Write-Host "`nAPI Gateway: $API_URL`n" -ForegroundColor Cyan
    
    Write-Host "Note: For production, set up Cloud Load Balancer with custom domain" -ForegroundColor Yellow
} else {
    Write-Host "`n========================================" -ForegroundColor Red
    Write-Host "[FAILED] Deployment Failed" -ForegroundColor Red
    Write-Host "========================================`n" -ForegroundColor Red
    exit 1
}
