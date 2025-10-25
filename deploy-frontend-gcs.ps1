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
$bucketExists = gsutil ls -b gs://$BUCKET_NAME 2>$null
if (-not $bucketExists) {
    Write-Host "Creating new bucket..." -ForegroundColor Yellow
    gsutil mb -p $PROJECT_ID -c STANDARD -l asia-south1 gs://$BUCKET_NAME
    
    # Make bucket public
    gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME
    
    # Set website configuration
    gsutil web set -m index.html -e index.html gs://$BUCKET_NAME
    
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
gsutil -m rsync -r -d $APP_DIR/dist gs://$BUCKET_NAME

# Set cache headers
Write-Host "Setting cache headers..." -ForegroundColor Cyan
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://$BUCKET_NAME/**/*.js
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://$BUCKET_NAME/**/*.css
gsutil -m setmeta -h "Cache-Control:public, max-age=3600" gs://$BUCKET_NAME/index.html

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "[SUCCESS] Frontend Deployed!" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Green
    
    Write-Host "Your app is accessible at:" -ForegroundColor Yellow
    Write-Host "https://storage.googleapis.com/$BUCKET_NAME/index.html" -ForegroundColor Cyan
    Write-Host "`nFor custom domain, set up Cloud Load Balancer with:" -ForegroundColor Yellow
    Write-Host "Backend bucket: $BUCKET_NAME" -ForegroundColor Cyan
    Write-Host "`nAPI Gateway: $API_URL`n" -ForegroundColor Cyan
} else {
    Write-Host "`n========================================" -ForegroundColor Red
    Write-Host "[FAILED] Deployment Failed" -ForegroundColor Red
    Write-Host "========================================`n" -ForegroundColor Red
    exit 1
}
