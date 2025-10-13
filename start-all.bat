@echo off
REM Store Rating App - Start Both Frontend and Backend
REM This script starts both servers in separate windows

echo Starting Store Rating App - Full Stack...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo ✅ Both servers are starting!
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Close the separate windows to stop the servers.
echo.
pause
