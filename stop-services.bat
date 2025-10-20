@echo off
echo 🛑 Stopping Doxify services...
echo.

echo Stopping Docker containers...
docker-compose -f docker-compose.local-mongo.yml down

echo.
echo ✅ All services stopped!
echo.
echo 💡 MongoDB is still running locally (not stopped)
echo    To stop MongoDB: net stop MongoDB
echo.
pause
