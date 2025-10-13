@echo off
REM Store Rating App - Backend Start Script
REM This script starts the Node.js backend server

echo Starting Store Rating App Backend...
echo.

cd backend
echo Changed to backend directory
echo.

echo Installing dependencies (if needed)...
call npm install
echo.

echo Starting server...
echo The server will run on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

call npm start
