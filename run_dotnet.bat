@echo off
title NVN India Private Limited - ASP.NET Core & SQL Server Portal (Jammalamadugu)
echo ==============================================================================
echo  NVN INDIA PRIVATE LIMITED - Enterprise Portal (.NET 10.0 & SQL Server)
echo  Headquarters: Jammalamadugu, YSR Kadapa District, Andhra Pradesh - 516434
echo ==============================================================================
echo.
echo Starting ASP.NET Core Web Application on http://localhost:5000...
echo Database Engine: Microsoft SQL Server (LocalDB) / SQLite Dual Engine
echo.
start http://localhost:5000
.\bin\Debug\net10.0\NVNIndiaServer.exe --urls "http://localhost:5000"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Running via dotnet run...
    dotnet run --urls "http://localhost:5000"
)
pause
