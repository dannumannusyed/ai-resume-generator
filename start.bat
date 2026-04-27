@echo off
cd /d "%~dp0"
title AI Resume Generator - Starter

echo ================================================================
echo    AI RESUME GENERATOR - SYSTEM STARTER
echo ================================================================
echo.

REM 1. Check if Node.js is installed
echo [1/4] Checking environment...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed.
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js is detected.

REM 2. Check for dependencies
echo.
echo [2/4] Checking dependencies...
if not exist "node_modules" (
    echo node_modules not found. Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo Error: npm install failed.
        pause
        exit /b 1
    )
) else (
    echo Dependencies are ready.
)

REM 3. Check for environment variables
echo.
echo [3/4] Preparing environment variables...
if not exist ".env.local" (
    if exist ".env.local.example" (
        echo .env.local not found. Creating from example...
        copy ".env.local.example" ".env.local"
        echo WARNING: Please update .env.local with your API keys!
    ) else (
        echo Error: .env.local and .env.local.example missing.
        pause
        exit /b 1
    )
) else (
    echo .env.local is ready.
)

REM 4. Start the application
echo.
echo [4/4] Starting Frontend and API...
echo Starting server on http://localhost:3000 ...
echo.

REM Open browser in 5 seconds
start powershell -WindowStyle Hidden -Command "Start-Sleep -s 5; Start-Process 'http://localhost:3000'"

REM Run the app
call npm run dev

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo The server stopped or failed to start.
    pause
)
