#!/usr/bin/env pwsh
# Doxify Frontend Cloud Run Deployment

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deploying Frontend to Cloud Run" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$PROJECT_ID = "doxify-prod"
$REGION = "asia-south1"
$SERVICE_NAME = "doxify-frontend"
$API_URL = "https://doxify-api-gateway-wqgm3vw2ta-el.a.run.app"
$IMAGE_NAME = "gcr.io/$PROJECT_ID/$SERVICE_NAME"

Write-Host "Project: $PROJECT_ID" -ForegroundColor Yellow
Write-Host "Region: $REGION" -ForegroundColor Yellow
Write-Host "API URL: $API_URL" -ForegroundColor Yellow
Write-Host ""

# Set project
gcloud config set project $PROJECT_ID

# Delete Cloud Storage bucket if exists
Write-Host "Cleaning up old Cloud Storage deployment..." -ForegroundColor Cyan
gcloud storage buckets delete gs://doxify-prod-web --quiet 2>$null
Write-Host "Cleanup complete" -ForegroundColor Green
Write-Host ""

# Build image with Cloud Build
Write-Host "Building frontend container..." -ForegroundColor Cyan
gcloud builds submit apps/web `
    --tag $IMAGE_NAME `
    --build-arg VITE_API_URL=$API_URL `
    --build-arg VITE_APP_NAME=Doxify

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[FAILED] Build failed" -ForegroundColor Red
    exit 1
}

# Deploy to Cloud Run
Write-Host ""
Write-Host "Deploying to Cloud Run..." -ForegroundColor Cyan
gcloud run deploy $SERVICE_NAME `
    --image $IMAGE_NAME `
    --region $REGION `
    --platform managed `
    --allow-unauthenticated `
    --port 8080 `
    --memory 512Mi `
    --cpu 1 `
    --min-instances 0 `
    --max-instances 10

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "[SUCCESS] Frontend Deployed!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    $URL = gcloud run services describe $SERVICE_NAME --region $REGION --format="value(status.url)"
    Write-Host "Frontend URL: $URL" -ForegroundColor Cyan
    Write-Host "API Gateway: $API_URL" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "[FAILED] Deployment failed" -ForegroundColor Red
    exit 1
}
