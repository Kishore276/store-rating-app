@echo off
REM Store Rating App - Backend Development Mode
REM This script starts the backend with auto-reload (nodemon)

echo Starting Store Rating App Backend (Development Mode)...
echo.

cd backend
echo Changed to backend directory
echo.

echo Installing dependencies (if needed)...
call npm install
echo.

echo Starting server with nodemon (auto-reload)...
echo The server will run on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

call npm run dev
