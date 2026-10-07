$ErrorActionPreference = "Stop"

Write-Host "Building Next.js application..."
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$standalone = Join-Path $PSScriptRoot "..\.next\standalone"
New-Item -ItemType Directory -Path (Join-Path $standalone ".next\static") -Force | Out-Null
Copy-Item -Path (Join-Path $PSScriptRoot "..\.next\static\*") -Destination (Join-Path $standalone ".next\static") -Recurse -Force
New-Item -ItemType Directory -Path (Join-Path $standalone "public") -Force | Out-Null
Copy-Item -Path (Join-Path $PSScriptRoot "..\public\*") -Destination (Join-Path $standalone "public") -Recurse -Force

Write-Host "Building Windows installer..."
npx electron-builder --win nsis
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Done. Installer is in the release folder."
