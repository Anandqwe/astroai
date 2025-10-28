@echo off
echo ============================================
echo   Starting AstroAI Development Server
echo ============================================
echo.

cd /d "%~dp0frontend"

echo Starting React development server...
echo The app will open at http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start
