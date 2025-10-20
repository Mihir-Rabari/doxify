# 🚀 Running Doxify with PM2

PM2 is a production-grade process manager for Node.js. It's perfect for development as it's much lighter than Docker!

## ✅ Prerequisites

- Node.js 20+
- MongoDB installed locally and running
- PM2 (will be auto-installed by the script)

## 🎯 Quick Start

### **Start Everything with PM2**

```bash
cd k:/projects/doxify
start-pm2.bat
```

This will:
- ✅ Install PM2 if not already installed
- ✅ Check and start MongoDB if needed
- ✅ Install dependencies for all services
- ✅ Start all 7 microservices + frontend
- ✅ Show you the PM2 dashboard

### **Stop Everything**

```bash
stop-pm2.bat
```

## 🔧 Manual PM2 Commands

### Install PM2 Globally
```bash
npm install -g pm2
```

### Start Services
```bash
# Start all services
pm2 start ecosystem.config.js

# Start specific service
pm2 start ecosystem.config.js --only auth-service
```

### View Services
```bash
# List all processes
pm2 list

# View logs (all services)
pm2 logs

# View logs for specific service
pm2 logs auth-service

# Monitor in real-time
pm2 monit
```

### Manage Services
```bash
# Restart all
pm2 restart all

# Restart specific service
pm2 restart auth-service

# Stop all
pm2 stop all

# Delete all (stops and removes from PM2)
pm2 delete all

# Save process list (auto-start on reboot)
pm2 save
pm2 startup
```

## 📊 What Gets Started

PM2 starts these 8 processes:

1. **auth-service** (Port 4001) - Authentication & users
2. **projects-service** (Port 4002) - Project management
3. **pages-service** (Port 4003) - Page CRUD
4. **parser-service** (Port 4004) - MDX parsing
5. **theme-service** (Port 4005) - Theme customization
6. **export-service** (Port 4006) - Static site export
7. **api-gateway** (Port 4000) - Main API entry point
8. **frontend** (Port 5173) - React frontend

## 🌐 Access URLs

- **Frontend:** http://localhost:5173
- **API Gateway:** http://localhost:4000
- **MongoDB:** mongodb://localhost:27017

## 💡 Benefits of PM2

✅ **No Docker overhead** - Native Node.js processes  
✅ **Faster startup** - Instant start, no container build  
✅ **Better for development** - Easier debugging  
✅ **Auto-restart** - Crashes are automatically recovered  
✅ **Built-in monitoring** - `pm2 monit` shows CPU/Memory  
✅ **Log management** - `pm2 logs` for all services  
✅ **Zero config** - Works out of the box  
✅ **Saves bandwidth** - No Docker images to download  

## 🔍 Monitoring & Debugging

### View Real-Time Logs
```bash
# All services
pm2 logs

# Specific service
pm2 logs auth-service --lines 100

# Follow logs
pm2 logs --lines 0
```

### Monitor Resources
```bash
pm2 monit
```

Shows:
- CPU usage per process
- Memory usage per process
- Logs in real-time

### Check Status
```bash
pm2 list
```

Shows:
- Process name
- Status (online/stopped)
- CPU %
- Memory usage
- Restart count
- Uptime

## 🐛 Debugging

### View Detailed Info
```bash
pm2 show auth-service
```

### Restart on File Changes (for development)
```bash
pm2 start ecosystem.config.js --watch
```

### Check Logs for Errors
```bash
pm2 logs --err
```

## ⚙️ Configuration

The `ecosystem.config.js` file defines all services. You can modify:

- **Port numbers** - Change `PORT` env variable
- **MongoDB URI** - Change `MONGODB_URI`
- **Auto-restart** - Set `autorestart: true/false`
- **Memory limit** - Set `max_memory_restart`
- **Watch mode** - Set `watch: true` for hot reload

Example modification:
```javascript
{
  name: 'auth-service',
  cwd: './services/auth-service',
  script: 'npm',
  args: 'run dev',
  env: {
    PORT: 4001,
    MONGODB_URI: 'mongodb://localhost:27017/doxify',
  },
  watch: true,  // Enable hot reload
  autorestart: true,
  max_memory_restart: '300M',
}
```

## 🔄 PM2 vs Docker

| Feature | PM2 | Docker |
|---------|-----|--------|
| Startup Speed | ⚡ Instant | 🐌 Slower |
| Memory Usage | 💚 Low | 💛 Higher |
| Development | ✅ Excellent | ⚠️ Overhead |
| Production | ⚠️ Need PM2 on server | ✅ Best |
| Debugging | ✅ Easy | ⚠️ Harder |
| Bandwidth | ✅ None | ⚠️ ~500MB |
| Learning Curve | ✅ Simple | ⚠️ Steeper |

## 🚀 Production Use

For production, you can also use PM2:

```bash
# Build all services
npm run build

# Start in production mode
pm2 start ecosystem.config.js --env production

# Save process list
pm2 save

# Setup auto-start on server reboot
pm2 startup
```

## ⚠️ Troubleshooting

### PM2 Not Found
```bash
npm install -g pm2
```

### MongoDB Connection Errors
```bash
# Check MongoDB is running
sc query MongoDB

# Start MongoDB
net start MongoDB
```

### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :4000

# Kill process
taskkill /PID <PID> /F
```

### Services Not Starting
```bash
# Check logs
pm2 logs

# Restart service
pm2 restart <service-name>

# Delete and restart all
pm2 delete all
pm2 start ecosystem.config.js
```

### Dependencies Missing
```bash
# Install all dependencies
npm install

# Or run the install script
start-pm2.bat
```

## 🎯 Recommended Workflow

1. **Start services:** `start-pm2.bat`
2. **Open browser:** http://localhost:5173
3. **Monitor logs:** `pm2 logs` (in another terminal)
4. **Make changes** - Services auto-restart on crash
5. **View status:** `pm2 list`
6. **Stop when done:** `stop-pm2.bat`

## 💡 Pro Tips

1. **Use `pm2 monit`** - Best real-time monitoring
2. **Keep logs open** - `pm2 logs` in separate terminal
3. **Save your setup** - `pm2 save` to remember processes
4. **Enable watch mode** - For hot reload during development
5. **Check health** - `pm2 list` shows restart count (should be low)

---

**PM2 makes development super smooth! Enjoy! 🚀**
