@echo off
REM Store Rating App - Frontend Build Script
REM This script creates a production build

echo Building Store Rating App Frontend...
echo.

cd frontend
echo Changed to frontend directory
echo.

echo Creating production build...
call npm run build
echo.

echo Build complete!
echo The production files are in the 'build' folder
echo.

pause
