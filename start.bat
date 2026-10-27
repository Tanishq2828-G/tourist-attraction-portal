@echo off
title Tourist Attraction Information Service Portal
cd /d "%~dp0"

echo ============================================================
echo   Tourist Attraction Information Service Portal
echo ============================================================
echo.

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found on your system!
    echo Please install Node.js from https://nodejs.org/ to run this portal.
    echo.
    pause
    exit /b 1
)

:: 2. Check and initialize environment variables if missing
if not exist "backend\.env" (
    if exist "backend\.env.example" (
        copy "backend\.env.example" "backend\.env" >nul
        echo [INFO] Created backend\.env configuration.
    )
)

:: 3. Check and install dependencies if node_modules is missing
if not exist "backend\node_modules" (
    echo [INFO] Installing required dependencies - first time setup...
    cd backend
    call npm install
    cd ..
    echo [OK] Dependencies installed.
    echo.
)

:: 4. Launch browser and start backend server
echo [INFO] Starting server on http://localhost:3000
echo [INFO] Opening default web browser...
start "" "http://localhost:3000"
echo.
echo ============================================================
echo   Website running at: http://localhost:3000
echo   Press Ctrl+C in this window anytime to stop the server.
echo ============================================================
echo.

cd backend
node server.js

pause

