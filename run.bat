@echo off
title NVN India Private LTD - IT Solutions & Tech Academy Portal
echo =====================================================================
echo  NVN India Private LTD - Web Portal & Relational Database System
echo =====================================================================
echo [1/2] Verifying Python and Database...
python -c "import sqlite3; print('SQLite 3 is ready.')"

echo [2/2] Launching Flask Web Server on http://localhost:5000 ...
start http://localhost:5000
python server.py

pause
