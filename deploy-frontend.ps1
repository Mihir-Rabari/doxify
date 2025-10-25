#!/usr/bin/env pwsh
# Doxify Frontend Deployment Script
# Deploy React/Vite app to Firebase Hosting

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Deploying Doxify Frontend to Firebase" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Configuration
$PROJECT_ID = "doxify-prod"
$APP_DIR = "apps/web"
$API_URL = "https://doxify-api-gateway-wqgm3vw2ta-el.a.run.app"

Write-Host "Project: $PROJECT_ID" -ForegroundColor Yellow
Write-Host "API URL: $API_URL`n" -ForegroundColor Yellow

# Set GCP project
Write-Host "Setting GCP project..." -ForegroundColor Cyan
gcloud config set project $PROJECT_ID

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

# Deploy to Firebase Hosting
Write-Host "`nDeploying to Firebase Hosting..." -ForegroundColor Cyan
firebase deploy --only hosting --project $PROJECT_ID

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "[SUCCESS] Frontend Deployed!" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Green
    
    Write-Host "Your app is now live at:" -ForegroundColor Yellow
    Write-Host "https://$PROJECT_ID.web.app" -ForegroundColor Cyan
    Write-Host "https://$PROJECT_ID.firebaseapp.com`n" -ForegroundColor Cyan
} else {
    Write-Host "`n========================================" -ForegroundColor Red
    Write-Host "[FAILED] Deployment Failed" -ForegroundColor Red
    Write-Host "========================================`n" -ForegroundColor Red
    exit 1
}
