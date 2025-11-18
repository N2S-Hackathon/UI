# Start Development Server Script
# This script ensures Node.js is in PATH before starting the dev server

$env:Path = "C:\Program Files\nodejs;$env:Path"

Write-Host "Starting Vite development server..." -ForegroundColor Green
Write-Host "The server will open automatically at http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

npm run dev

