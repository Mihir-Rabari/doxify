#!/usr/bin/env pwsh
# Doxify Frontend Cloud Run Deployment

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Deploying Frontend to Cloud Run" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$PROJECT_ID = "doxify-prod"
$REGION = "asia-south1"
$SERVICE_NAME = "doxify-frontend"
$API_URL = "https://doxify-api-gateway-wqgm3vw2ta-el.a.run.app"

Write-Host "Project: $PROJECT_ID" -ForegroundColor Yellow
Write-Host "Region: $REGION" -ForegroundColor Yellow
Write-Host "API URL: $API_URL`n" -ForegroundColor Yellow

# Set project
gcloud config set project $PROJECT_ID

# Delete Cloud Storage bucket if exists
Write-Host "Cleaning up old Cloud Storage deployment..." -ForegroundColor Cyan
gcloud storage buckets delete gs://doxify-prod-web --quiet 2>$null
Write-Host "Cleanup complete`n" -ForegroundColor Green

# Build and deploy to Cloud Run
Write-Host "Building and deploying frontend..." -ForegroundColor Cyan

gcloud run deploy $SERVICE_NAME `
    --source apps/web `
    --region $REGION `
    --platform managed `
    --allow-unauthenticated `
    --port 8080 `
    --memory 512Mi `
    --cpu 1 `
    --min-instances 0 `
    --max-instances 10 `
    --set-env-vars "VITE_API_URL=$API_URL,VITE_APP_NAME=Doxify"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "[SUCCESS] Frontend Deployed!" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Green
    
    $URL = gcloud run services describe $SERVICE_NAME --region $REGION --format="value(status.url)"
    Write-Host "Frontend URL: $URL" -ForegroundColor Cyan
    Write-Host "API Gateway: $API_URL`n" -ForegroundColor Yellow
} else {
    Write-Host "`n[FAILED] Deployment failed`n" -ForegroundColor Red
    exit 1
}
