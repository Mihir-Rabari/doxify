#!/usr/bin/env pwsh
# Test API Gateway Forwarding

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing API Gateway Forwarding" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$API_GATEWAY = "https://doxify-api-gateway-wqgm3vw2ta-el.a.run.app"

# Test endpoints
$endpoints = @(
    @{Path="/health"; Name="API Gateway Health"},
    @{Path="/api/auth/health"; Name="Auth Service"},
    @{Path="/api/projects/health"; Name="Projects Service"},
    @{Path="/api/pages/health"; Name="Pages Service"},
    @{Path="/api/parser/health"; Name="Parser Service"},
    @{Path="/api/theme/health"; Name="Theme Service"},
    @{Path="/api/export/health"; Name="Export Service"},
    @{Path="/api/view/health"; Name="Viewer Service"},
    @{Path="/api/mcp/health"; Name="MCP Service"}
)

foreach ($endpoint in $endpoints) {
    $url = "$API_GATEWAY$($endpoint.Path)"
    Write-Host "Testing $($endpoint.Name)..." -ForegroundColor Yellow -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 10 -UseBasicParsing
        
        if ($response.StatusCode -eq 200) {
            Write-Host " ✓ OK" -ForegroundColor Green
            $content = $response.Content | ConvertFrom-Json
            Write-Host "  Response: $($content | ConvertTo-Json -Compress)" -ForegroundColor Gray
        } else {
            Write-Host " ✗ Status: $($response.StatusCode)" -ForegroundColor Red
        }
    } catch {
        Write-Host " ✗ FAILED" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
