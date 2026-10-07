@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js не найден. Установите Node.js LTS и запустите файл снова.
  pause
  exit /b 1
)

if not exist "node_modules\next\package.json" (
  echo Устанавливаю зависимости...
  call npm install
  if errorlevel 1 (
    echo Не удалось установить зависимости.
    pause
    exit /b 1
  )
)

start "ED Generator" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul
start "" http://localhost:3000

endlocal
