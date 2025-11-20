# Save Images Script for Cerope MERN Application
$imagesDir = "frontend\public\images"

# Check if directory exists
if (-not (Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir -Force | Out-Null
    Write-Host "Created images directory" -ForegroundColor Green
}

Write-Host "Please save the following images to: $imagesDir" -ForegroundColor Yellow
Write-Host ""
Write-Host "Required Images:" -ForegroundColor White
Write-Host "  1. holographic-dress.jpg - The blue holographic wireframe dress" -ForegroundColor White
Write-Host "  2. fashion-couple.jpg - The fashion couple background" -ForegroundColor White
Write-Host "  3. cerope-logo.svg - The Cerope logo (wave/leaves)" -ForegroundColor White
Write-Host ""

# Create SVG logo
$logoSvg = '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 10 C 14 10, 10 20, 14 30 C 18 40, 22 42, 24 42" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/><path d="M34 10 C 34 10, 38 20, 34 30 C 30 40, 26 42, 24 42" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/><path d="M20 8 C 20 8, 18 15, 20 22 C 22 29, 24 30, 24 30" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M28 8 C 28 8, 30 15, 28 22 C 26 29, 24 30, 24 30" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>'

$logoPath = Join-Path $imagesDir "cerope-logo.svg"
Set-Content -Path $logoPath -Value $logoSvg -Encoding UTF8
Write-Host "Created cerope-logo.svg" -ForegroundColor Green
Write-Host ""

# Open the images directory
Start-Process explorer.exe -ArgumentList (Resolve-Path $imagesDir)
