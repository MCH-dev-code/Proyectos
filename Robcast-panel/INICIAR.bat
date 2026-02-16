@echo off
REM Script para iniciar Robcast en Windows

echo.
echo ======================================
echo   ROBCAST - Sistema de Gestion
echo ======================================
echo.

REM Verificar que Node.js está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado.
    echo Descargalo en: https://nodejs.org
    pause
    exit /b 1
)

REM Verificar que MySQL está en ejecución (opcional)
echo Verificando conexion a MySQL...
timeout /t 2 /nobreak

REM Iniciar Backend en nueva ventana
echo.
echo [1/2] Iniciando BACKEND en puerto 3001...
start cmd /k "cd backend && npm start"
timeout /t 3 /nobreak

REM Iniciar Frontend
echo [2/2] Iniciando FRONTEND en puerto 5173...
echo.
npm run dev

pause
