@echo off
cd /d "C:\Users\kumar\Desktop\NVN-India-Portal"

:: Check if server is already running on port 5000
netstat -ano | findstr :5000 | findstr LISTENING >nul
if %errorlevel% neq 0 (
    start "NVN India Portal Server" /min cmd /c "bin\Debug\net10.0\NVNIndiaServer.exe --urls http://localhost:5000"
    timeout /t 3 /nobreak >nul
)

:: Check if cloudflared is already running
tasklist /fi "imagename eq cloudflared.exe" | findstr cloudflared.exe >nul
if %errorlevel% neq 0 (
    start "Cloudflare Tunnel - nvnindia.com" /min cmd /c "tools\cloudflared.exe tunnel run --url http://localhost:5000 --token eyJhIjoiOTc1YTZmM2FhY2ZjMTg1YWMzMWExNmM2NDU2MmE3ZDciLCJ0IjoiZTg3N2IyNmEtMTMxMC00ZjYyLWE0NDctZTRkOTRkZWYxMmM0IiwicyI6Ik1qUXdNalF4TkdVdFl6WXhNaTAwWVRGbExXRmxZVGt0TmpGaE16Qm1NelZoWVRJMiJ9"
)
