@echo off
echo ============================================
echo   AstroAI Frontend Setup
echo ============================================
echo.

cd /d "%~dp0frontend"

echo [1/3] Installing dependencies...
echo This may take a few minutes...
echo.

call npm install --legacy-peer-deps

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Installation failed!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

echo.
echo ============================================
echo   Installation Complete!
echo ============================================
echo.
echo To start the development server, run:
echo   npm start
echo.
echo Or run: start-dev.bat
echo.
pause
