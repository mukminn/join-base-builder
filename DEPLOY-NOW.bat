@echo off
title Deploy to Vercel - Manual
echo ========================================
echo   Deploy Manual ke Vercel
echo ========================================
echo.
echo Pastikan:
echo 1. Vercel CLI sudah installed (npm install -g vercel)
echo 2. Sudah login (vercel login)
echo 3. Root Directory di Vercel Dashboard set ke: mini-app
echo.
echo ========================================
echo.

cd /d "%~dp0"

echo Deploying to Vercel...
vercel --prod

echo.
echo ========================================
echo   Deployment selesai!
echo ========================================
pause
