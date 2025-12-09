@echo off
title Bharat Panchayat Transparency - Starter
setlocal

REM === 1) Project root par aa jao ===
cd /d "D:\python practice\BHARAT PANCHAYAT TRANSPARENCY"

REM === 2) Backend start karo (FastAPI + Uvicorn) ===
echo Starting backend server...
start "Backend" cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload"

REM Backend ko boot hone ke liye thoda time do
timeout /t 5 /nobreak >nul

REM === 3) Frontend start karo (React) ===
echo Starting frontend (React)...
start "Frontend" cmd /k "cd frontend && npm start"

REM React ko build hone ke liye time do
timeout /t 8 /nobreak >nul

REM === 4) Browser me app open karo ===
echo Opening app in browser...
start "" "http://localhost:3000"

echo All services started. You can close this window.
endlocal
exit
