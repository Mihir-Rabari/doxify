# Firestore Migration Script
# This script installs Firestore SDK and removes Mongoose from all services

Write-Host "Starting Firestore Migration..." -ForegroundColor Cyan
Write-Host ""

$services = @(
    "auth-service",
    "projects-service",
    "pages-service",
    "theme-service",
    "export-service",
    "viewer-service",
    "mcp-service"
)

foreach ($service in $services) {
    Write-Host "Updating $service..." -ForegroundColor Yellow
    $servicePath = "services\$service"
    
    if (Test-Path $servicePath) {
        Push-Location $servicePath
        
        # Install Firestore
        Write-Host "  Installing @google-cloud/firestore..."
        npm install --save @google-cloud/firestore@^7.1.0 2>&1 | Out-Null
        
        # Remove Mongoose  
        Write-Host "  Removing mongoose..."
        npm uninstall mongoose 2>&1 | Out-Null
        
        Pop-Location
        Write-Host "  Done: $service" -ForegroundColor Green
    } else {
        Write-Host "  Warning: $service not found" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "Migration complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Review the FIRESTORE_MIGRATION.md document"
Write-Host "  2. Test services locally"
Write-Host "  3. Deploy to GCP Cloud Run"
Write-Host ""
