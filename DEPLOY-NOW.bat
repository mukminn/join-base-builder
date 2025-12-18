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
echo.
echo Pilih opsi:
echo 1. Link ke project yang sudah ada (join-base-builder)
echo 2. Deploy langsung
echo.
echo Jika belum link, akan diminta:
echo - Project name: join-base-builder
echo - Root directory: mini-app
echo.
pause

vercel --prod --yes

echo.
echo ========================================
echo   Deployment selesai!
echo ========================================
pause
