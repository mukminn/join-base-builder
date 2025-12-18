# PowerShell script to start Python HTTP Server
Write-Host "Starting Python HTTP Server on port 9000..." -ForegroundColor Green
Write-Host ""

# Get script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Start server
python -m http.server 9000
