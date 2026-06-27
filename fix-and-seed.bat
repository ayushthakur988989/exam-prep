@echo off
:: Database Setup and Seeding Script for Windows
:: This script will start MongoDB, seed the database, and start the server.

echo ===================================================
echo 🔍 STEP 1: Checking and Starting MongoDB Service...
echo ===================================================
net session >nul 2>&1
if %errorLevel% == 0 (
    echo [INFO] Running as Administrator. Attempting to start MongoDB service...
    net start MongoDB
) else (
    echo [WARNING] Not running as Administrator.
    echo [INFO] Attempting to start MongoDB service (might prompt for admin permissions)...
    powershell -Command "Start-Process cmd -ArgumentList '/c net start MongoDB' -Verb RunAs"
)

echo.
echo ===================================================
echo 🌱 STEP 2: Seeding Admin and User Credentials...
echo ===================================================
cd /d "%~dp0\server"
node seed.js

echo.
echo ===================================================
echo 🚀 STEP 3: Starting Backend Server...
echo ===================================================
npm run dev

pause
