@echo off
cd /d "%~dp0"
REM Development setup script for AI Resume Generator (Windows)

echo 🚀 Setting up AI Resume Generator...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% detected

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Setup environment
if not exist .env.local (
    echo 📝 Creating .env.local...
    copy .env.local.example .env.local
    echo ⚠️  Please update .env.local with your API keys
) else (
    echo ✅ .env.local already exists
)

REM Build project
echo 🏗️  Building project...
call npm run build

echo.
echo ✨ Setup complete!
echo.
echo Next steps:
echo 1. Update .env.local with your API keys
echo 2. Run 'npm run dev' to start the development server
echo 3. Visit http://localhost:3000
echo.
