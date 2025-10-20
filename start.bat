@echo off
echo 🚀 Starting Doxify...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker first.
    exit /b 1
)

echo ✅ Docker is running
echo.

REM Start backend services
echo 📦 Starting backend services with Docker Compose...
docker-compose up -d

echo.
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo ✅ Backend services started!
echo.
echo 📊 Service Status:
echo    - API Gateway:    http://localhost:4000
echo    - Auth Service:   http://localhost:4001
echo    - Projects:       http://localhost:4002
echo    - Pages:          http://localhost:4003
echo    - Parser:         http://localhost:4004
echo    - Theme:          http://localhost:4005
echo    - Export:         http://localhost:4006
echo    - MongoDB:        mongodb://localhost:27017
echo.

REM Check if frontend dependencies are installed
if not exist "apps\web\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd apps\web
    call npm install
    cd ..\..
    echo ✅ Frontend dependencies installed
    echo.
)

REM Start frontend
echo 🎨 Starting frontend...
cd apps\web

REM Create .env if it doesn't exist
if not exist ".env" (
    echo 📝 Creating .env file...
    copy .env.example .env
)

start cmd /k "npm run dev"

cd ..\..

echo.
echo ✅ Doxify is running!
echo.
echo 🌐 Open your browser:
echo    Frontend:  http://localhost:5173
echo    API:       http://localhost:4000
echo.
echo 📚 Next steps:
echo    1. Go to http://localhost:5173/register
echo    2. Create an account
echo    3. Create your first project
echo    4. Start writing documentation!
echo.
echo ⚠️  To stop services, close this window and run: docker-compose down
echo.
pause
