@echo off
echo 🚀 Starting Doxify with PM2...
echo.

REM Check if PM2 is installed
where pm2 >nul 2>nul
if errorlevel 1 (
    echo ⚠️  PM2 is not installed. Installing PM2 globally...
    call npm install -g pm2
    if errorlevel 1 (
        echo ❌ Failed to install PM2. Please run: npm install -g pm2
        pause
        exit /b 1
    )
    echo ✅ PM2 installed successfully!
    echo.
)

REM Check if MongoDB service is running
sc query MongoDB | find "RUNNING" >nul
if errorlevel 1 (
    echo ⚠️  MongoDB service is not running. Starting MongoDB...
    net start MongoDB
    if errorlevel 1 (
        echo ❌ Failed to start MongoDB. Please start it manually.
        pause
        exit /b 1
    )
) else (
    echo ✅ MongoDB is running locally
)
echo.

REM Install dependencies for all services
echo 📦 Checking and installing dependencies...
echo.

if not exist "services\auth-service\node_modules" (
    echo Installing auth-service dependencies...
    cd services\auth-service
    call npm install
    cd ..\..
)

if not exist "services\projects-service\node_modules" (
    echo Installing projects-service dependencies...
    cd services\projects-service
    call npm install
    cd ..\..
)

if not exist "services\pages-service\node_modules" (
    echo Installing pages-service dependencies...
    cd services\pages-service
    call npm install
    cd ..\..
)

if not exist "services\parser-service\node_modules" (
    echo Installing parser-service dependencies...
    cd services\parser-service
    call npm install
    cd ..\..
)

if not exist "services\theme-service\node_modules" (
    echo Installing theme-service dependencies...
    cd services\theme-service
    call npm install
    cd ..\..
)

if not exist "services\export-service\node_modules" (
    echo Installing export-service dependencies...
    cd services\export-service
    call npm install
    cd ..\..
)

if not exist "services\api-gateway\node_modules" (
    echo Installing api-gateway dependencies...
    cd services\api-gateway
    call npm install
    cd ..\..
)

if not exist "apps\web\node_modules" (
    echo Installing frontend dependencies...
    cd apps\web
    call npm install
    cd ..\..
)

echo.
echo ✅ All dependencies installed!
echo.

REM Create .env for frontend if it doesn't exist
if not exist "apps\web\.env" (
    echo 📝 Creating frontend .env file...
    copy apps\web\.env.example apps\web\.env
)

REM Stop any existing PM2 processes
echo 🔄 Stopping any existing PM2 processes...
call pm2 delete ecosystem.config.js >nul 2>nul

REM Start all services with PM2
echo 🚀 Starting all services with PM2...
call pm2 start ecosystem.config.js

if errorlevel 1 (
    echo ❌ Failed to start services with PM2
    pause
    exit /b 1
)

echo.
echo ⏳ Waiting for services to start...
timeout /t 5 /nobreak >nul

echo.
echo ✅ Doxify is running with PM2!
echo.
echo 📊 Service Status:
echo    - API Gateway:    http://localhost:4000
echo    - Auth Service:   http://localhost:4001
echo    - Projects:       http://localhost:4002
echo    - Pages:          http://localhost:4003
echo    - Parser:         http://localhost:4004
echo    - Theme:          http://localhost:4005
echo    - Export:         http://localhost:4006
echo    - Frontend:       http://localhost:5173
echo    - MongoDB:        mongodb://localhost:27017 (Local)
echo.
echo 📚 Next steps:
echo    1. Go to http://localhost:5173/register
echo    2. Create an account
echo    3. Create your first project
echo    4. Start writing documentation!
echo.
echo 💡 Useful PM2 commands:
echo    - pm2 list           (View all processes)
echo    - pm2 logs           (View logs)
echo    - pm2 monit          (Monitor processes)
echo    - pm2 stop all       (Stop all services)
echo    - pm2 restart all    (Restart all services)
echo.
echo ⚠️  To stop all services, run: stop-pm2.bat
echo.
pause
