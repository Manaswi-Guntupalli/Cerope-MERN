# Cerope MERN Application - Start Script
# This script starts both backend and frontend servers

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Starting Cerope MERN Application" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a port is in use
function Test-Port {
    param($Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue -InformationLevel Quiet
    return $connection
}

# Check if ports are available
Write-Host "Checking ports..." -ForegroundColor Yellow

if (Test-Port 5000) {
    Write-Host "⚠ Port 5000 is already in use. Backend may fail to start." -ForegroundColor Yellow
    Write-Host "  Stop the application using port 5000 or change PORT in backend/.env" -ForegroundColor Gray
}

if (Test-Port 3000) {
    Write-Host "⚠ Port 3000 is already in use. Frontend will use a different port." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting servers..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Gray
Write-Host ""

# Start backend in a new window
Write-Host "Starting Backend Server..." -ForegroundColor Green
$backend = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; Write-Host 'Backend Server' -ForegroundColor Cyan; npm run dev" -PassThru

Start-Sleep -Seconds 3

# Start frontend in a new window
Write-Host "Starting Frontend Server..." -ForegroundColor Green
$frontend = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; Write-Host 'Frontend Server' -ForegroundColor Cyan; npm run dev" -PassThru

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "Servers Started!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Two PowerShell windows should have opened." -ForegroundColor White
Write-Host "Close those windows to stop the servers." -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this script (servers will continue running)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
