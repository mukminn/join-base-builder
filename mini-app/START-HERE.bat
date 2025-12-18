@echo off
title Base Builders December - Mini App Server
echo ========================================
echo   Base Builders December - Mini App
echo ========================================
echo.
echo Starting server on port 9000...
echo.
echo Server akan running di: http://localhost:9000
echo.
echo JANGAN TUTUP WINDOW INI!
echo Tekan Ctrl+C untuk stop server
echo.
echo ========================================
echo.

cd /d "%~dp0"
echo.
echo Testing server...
node simple-server.js

pause
