@echo off
echo ============================================
echo     EduGuard AI - Starting Application
echo ============================================
echo.

echo [1/2] Starting Backend (port 5000)...
cd backend
start cmd /k "npm install && node server.js"
cd ..

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend (port 3000)...
cd frontend
start cmd /k "npm install && npm run dev"
cd ..

echo.
echo ============================================
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:3000
echo ============================================
echo.
echo Opening browser...
timeout /t 4 /nobreak >nul
start http://localhost:3000
