@echo off
title Deploy to Vercel - Manual (SINGLE DEPLOY)
echo ========================================
echo   Deploy Manual ke Vercel
echo   JANGAN DOUBLE DEPLOY!
echo ========================================
echo.
echo Pastikan:
echo 1. Vercel CLI sudah installed (npm install -g vercel)
echo 2. Sudah login (vercel login)
echo 3. Auto-deploy di Vercel Dashboard DISABLED
echo 4. Root Directory di Vercel Dashboard set ke: mini-app
echo.
echo ========================================
echo.

cd /d "%~dp0"

echo Checking for existing deployment...
echo.

cd mini-app

echo Deploying to Vercel (SINGLE DEPLOY)...
echo.
vercel --prod --yes

echo.
echo ========================================
echo   Deployment selesai!
echo   JANGAN deploy lagi sampai ada perubahan!
echo ========================================
pause
