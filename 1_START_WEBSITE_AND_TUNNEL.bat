@echo off
title NVN INDIA - Complete Website & Cloudflare Tunnel Launcher
echo ==============================================================================
echo   NVN INDIA PRIVATE LIMITED (CIN: U72900AP2024PTC189000)
echo   Official Portal & Global Cloudflare Tunnel Launcher
echo   Live Domains: https://www.nvnindia.com ^| https://nvnindia.com
echo ==============================================================================
echo.

cd /d "%~dp0"

echo [1/2] Starting Local Portal Server (http://localhost:5000)...
start "NVN India Portal Server" /min cmd /c "bin\Debug\net10.0\NVNIndiaServer.exe --urls http://localhost:5000"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Cloudflare Tunnel to nvnindia.com...
start "Cloudflare Tunnel - nvnindia.com" /min cmd /c "tools\cloudflared.exe tunnel run --url http://localhost:5000 --token eyJhIjoiOTc1YTZmM2FhY2ZjMTg1YWMzMWExNmM2NDU2MmE3ZDciLCJ0IjoiZTg3N2IyNmEtMTMxMC00ZjYyLWE0NDctZTRkOTRkZWYxMmM0IiwicyI6Ik1qUXdNalF4TkdVdFl6WXhNaTAwWVRGbExXRmxZVGt0TmpGaE16Qm1NelZoWVRJMiJ9"

echo.
echo ==============================================================================
echo  SUCCESS! Website is live and serving globally:
echo  - https://www.nvnindia.com
echo  - https://nvnindia.com
echo  - Local: http://localhost:5000
echo ==============================================================================
echo.
echo To open website in browser, press any key. To exit this window, close it.
pause >nul
start https://www.nvnindia.com
