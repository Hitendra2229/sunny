@echo off
title NVN INDIA - View All Enquiries & Admin Console
echo ==============================================================================
echo   NVN INDIA PRIVATE LIMITED - ENQUIRIES & ADMIN CONSOLE
echo ==============================================================================
echo.
cd /d "%~dp0"
python view_enquiries.py
echo.
echo ==============================================================================
echo [1] Press 1 to open online Admin Console in Browser (https://www.nvnindia.com/#adminSection)
echo [2] Press 2 to open the Excel CSV export (LATEST_ENQUIRIES_EXPORT.csv)
echo [3] Press any other key to exit
echo ==============================================================================
set /p opt="Choose option (1, 2, or 3): "
if "%opt%"=="1" start https://www.nvnindia.com/#adminSection
if "%opt%"=="2" start LATEST_ENQUIRIES_EXPORT.csv
echo.
