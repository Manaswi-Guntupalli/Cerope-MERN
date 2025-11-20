# Cerope MERN Application - Installation Script

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Cerope MERN Stack Installation" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking for Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "✗ Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if MongoDB is accessible
Write-Host "`nChecking for MongoDB..." -ForegroundColor Yellow
Write-Host "Note: Make sure MongoDB is installed and running" -ForegroundColor Gray
Write-Host "  - Local: MongoDB service should be running" -ForegroundColor Gray
Write-Host "  - Or use MongoDB Atlas cloud connection" -ForegroundColor Gray

# Install Backend Dependencies
Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "Installing Backend Dependencies" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Set-Location -Path "backend"
Write-Host "Running: npm install" -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend dependencies installed successfully" -ForegroundColor Green
}
else {
    Write-Host "✗ Backend installation failed" -ForegroundColor Red
    Set-Location -Path ".."
    exit 1
}
Set-Location -Path ".."

# Install Frontend Dependencies
Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "Installing Frontend Dependencies" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Set-Location -Path "frontend"
Write-Host "Running: npm install" -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend dependencies installed successfully" -ForegroundColor Green
}
else {
    Write-Host "✗ Frontend installation failed" -ForegroundColor Red
    Set-Location -Path ".."
    exit 1
}
Set-Location -Path ".."

# Success Message
Write-Host "`n================================" -ForegroundColor Green
Write-Host "Installation Complete! ✓" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Make sure MongoDB is running" -ForegroundColor White
Write-Host "2. Open TWO terminal windows" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 1 - Start Backend:" -ForegroundColor Yellow
Write-Host "  cd backend" -ForegroundColor Gray
Write-Host "  npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "Terminal 2 - Start Frontend:" -ForegroundColor Yellow
Write-Host "  cd frontend" -ForegroundColor Gray
Write-Host "  npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "Then open your browser to: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "For detailed instructions, see README.md or QUICKSTART.md" -ForegroundColor Gray
Write-Host ""
