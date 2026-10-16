@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "PATH=C:\Program Files\Git\cmd;C:\Users\zhang\.local\node\node-v22.23.3-win-x64;%PATH%"
node "%~dp0tools\preview.cjs"
echo.
pause
