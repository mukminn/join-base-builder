@echo off
echo Starting Python HTTP Server on port 9000...
echo.
cd /d "%~dp0"
python -m http.server 9000
pause
