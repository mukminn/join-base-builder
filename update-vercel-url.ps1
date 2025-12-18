# PowerShell script untuk update manifest.json dengan Vercel URL
# Usage: .\update-vercel-url.ps1 -VercelUrl "https://your-app.vercel.app"

param(
    [Parameter(Mandatory=$true)]
    [string]$VercelUrl
)

$manifestPath = "mini-app\manifest.json"

if (Test-Path $manifestPath) {
    Write-Host "Updating manifest.json with Vercel URL: $VercelUrl" -ForegroundColor Green
    
    # Read manifest
    $manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
    
    # Update URLs
    $manifest.url = $VercelUrl
    $manifest.icon = "$VercelUrl/icon.png"
    $manifest.splash = "$VercelUrl/splash.png"
    
    # Save manifest
    $manifest | ConvertTo-Json -Depth 10 | Set-Content $manifestPath
    
    Write-Host "✅ manifest.json updated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. git add mini-app/manifest.json" -ForegroundColor Cyan
    Write-Host "2. git commit -m 'Update manifest with Vercel URL'" -ForegroundColor Cyan
    Write-Host "3. git push" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Vercel will auto-deploy the update!" -ForegroundColor Green
} else {
    Write-Host "❌ manifest.json not found at $manifestPath" -ForegroundColor Red
}
