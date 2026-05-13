@echo off
REM ============================================================
REM  Money Flow Daily Run
REM  Runs screener.py + tracker.py, logs everything.
REM  Schedule via Windows Task Scheduler at 4:30 PM Eastern (M-F).
REM ============================================================

cd /d %~dp0

if not exist logs mkdir logs

REM Reliable YYYY-MM-DD via PowerShell (locale-independent)
for /f "tokens=*" %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd"') do set DATESTAMP=%%i

set LOGFILE=logs\daily_%DATESTAMP%.log

echo. >> "%LOGFILE%"
echo ============================================================ >> "%LOGFILE%"
echo  Run started: %date% %time% >> "%LOGFILE%"
echo ============================================================ >> "%LOGFILE%"

echo [1/2] Running screener.py...
python screener.py >> "%LOGFILE%" 2>&1
if errorlevel 1 (
    echo SCREENER FAILED. Check %LOGFILE%
    echo Run aborted. >> "%LOGFILE%"
    exit /b 1
)
echo screener.py: OK

echo [2/2] Running tracker.py...
python tracker.py >> "%LOGFILE%" 2>&1
if errorlevel 1 (
    echo TRACKER FAILED. Check %LOGFILE%
    exit /b 1
)
echo tracker.py: OK

echo. >> "%LOGFILE%"
echo  Run finished: %date% %time% >> "%LOGFILE%"

echo Done. Log: %LOGFILE%
