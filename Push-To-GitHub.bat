@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================================
echo   Push Khmer Storyboard Studio to GitHub
echo   Repo: https://github.com/sendara168/khmerstorybord.git
echo ============================================================
echo.
"C:\Program Files\Git\cmd\git.exe" add .
"C:\Program Files\Git\cmd\git.exe" commit -m "Update Khmer Storyboard Studio" 2>nul
"C:\Program Files\Git\cmd\git.exe" push -u origin main
echo.
if %errorlevel%==0 (
  echo [SUCCESS] Code pushed to GitHub branch main!
) else (
  echo [ERROR] Push failed. Please sign in to GitHub in the popup window and try again.
)
pause
