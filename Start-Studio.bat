@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================================
echo   Khmer Storyboard Studio - 2D Educational Animation
echo ============================================================
echo.

REM Check if server is already listening on port 3001
netstat -ano | findstr ":3001 " | findstr "LISTENING" >nul 2>&1
if %errorlevel%==0 (
  echo [OK] Server is already running on http://127.0.0.1:3001
  start "" "http://127.0.0.1:3001"
  echo Opened in your browser!
  timeout /t 3 >nul
  exit /b 0
)

echo Starting server on http://127.0.0.1:3001 ...
start "" /b cmd /c "timeout /t 2 /nobreak >nul & start "" "http://127.0.0.1:3001""
node server/index.mjs
pause
