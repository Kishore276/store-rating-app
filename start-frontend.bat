@echo off
REM Store Rating App - Frontend Start Script
REM This script starts the React development server

echo Starting Store Rating App Frontend...
echo.

cd frontend
echo Changed to frontend directory
echo.

echo Installing dependencies (if needed)...
call npm install
echo.

echo Starting development server...
echo The app will open at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

call npm start
