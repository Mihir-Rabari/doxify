@echo off
echo 🛑 Stopping Doxify PM2 processes...
echo.

call pm2 delete ecosystem.config.js

echo.
echo ✅ All PM2 processes stopped!
echo.
echo 💡 MongoDB is still running (not stopped)
echo    To stop MongoDB: net stop MongoDB
echo.
pause
