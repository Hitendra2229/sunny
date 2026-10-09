@echo off
title Stop NVN India Website and Tunnel
echo ==============================================================================
echo   Stopping NVN India Portal Server and Cloudflare Tunnel...
echo ==============================================================================
echo.
taskkill /F /IM NVNIndiaServer.exe 2>nul
taskkill /F /IM cloudflared.exe 2>nul
echo Done! Both server and tunnel have been stopped.
echo.
pause
