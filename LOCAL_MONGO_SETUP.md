# 🚀 Running Doxify with Local MongoDB

This guide is for users who have MongoDB installed locally and want to save internet bandwidth by not downloading the MongoDB Docker image.

## ✅ Prerequisites

- Docker Desktop (for microservices only)
- MongoDB installed locally and running
- Node.js 20+ (for frontend)

## 🎯 Quick Start

### **Run with Local MongoDB**

```bash
cd k:/projects/doxify
start-local-mongo.bat
```

This will:
- ✅ Check if MongoDB is running (starts it if needed)
- ✅ Start backend services using local MongoDB
- ✅ Skip MongoDB Docker container (saves bandwidth!)
- ✅ Install and start frontend

### **Stop Services**

```bash
stop-services.bat
```

## 📊 What's Different?

### **Regular Setup** (docker-compose.yml)
- Downloads MongoDB Docker image (~500MB)
- Runs MongoDB in a container
- Uses containerized MongoDB

### **Local MongoDB Setup** (docker-compose.local-mongo.yml)
- Uses your existing MongoDB installation
- Saves ~500MB download
- Docker services connect to `host.docker.internal:27017`

## 🔧 Manual Setup

If you prefer manual control:

### 1. Ensure MongoDB is Running
```bash
# Check status
sc query MongoDB

# Start if not running
net start MongoDB
```

### 2. Start Backend Services
```bash
docker-compose -f docker-compose.local-mongo.yml up --build
```

### 3. Start Frontend
```bash
cd apps/web
npm install
copy .env.example .env
npm run dev
```

## 🌐 Access URLs

- **Frontend:** http://localhost:5173
- **API Gateway:** http://localhost:4000
- **MongoDB:** mongodb://localhost:27017 (your local installation)

## 🔍 Verify MongoDB Connection

Open MongoDB Compass or mongosh:
```bash
mongosh mongodb://localhost:27017/doxify
```

You should see:
- `users` collection
- `projects` collection
- `pages` collection

## ⚠️ Troubleshooting

### MongoDB Not Running
```bash
# Start MongoDB service
net start MongoDB

# Check if it's running
sc query MongoDB
```

### Docker Can't Connect to Local MongoDB
The docker-compose file uses `host.docker.internal:host-gateway` to allow containers to access your host machine's MongoDB.

If this doesn't work:
1. Check MongoDB is bound to `0.0.0.0` (not just `127.0.0.1`)
2. Check firewall settings
3. Make sure MongoDB port 27017 is not blocked

### Check MongoDB Binding
Open `C:\Program Files\MongoDB\Server\<version>\bin\mongod.cfg` and ensure:
```yaml
net:
  bindIp: 0.0.0.0  # or 127.0.0.1,host.docker.internal
  port: 27017
```

After changes, restart MongoDB:
```bash
net stop MongoDB
net start MongoDB
```

## 📝 MongoDB Configuration

Default local MongoDB configuration:
- **URI:** `mongodb://localhost:27017/doxify`
- **Database:** `doxify`
- **No authentication required** (default local setup)

If your MongoDB has authentication, update the services in `docker-compose.local-mongo.yml`:
```yaml
environment:
  - MONGODB_URI=mongodb://username:password@host.docker.internal:27017/doxify?authSource=admin
```

## 🎯 Benefits of Local MongoDB

✅ **Saves bandwidth** - No need to download 500MB Docker image  
✅ **Faster startup** - No container overhead  
✅ **Persistent data** - Data stays even after Docker restart  
✅ **Easy access** - Use MongoDB Compass directly  
✅ **Better performance** - Native connection  

## 🔄 Switching Between Setups

### Use Docker MongoDB (Original)
```bash
docker-compose up --build
```

### Use Local MongoDB
```bash
docker-compose -f docker-compose.local-mongo.yml up --build
```

## 💡 Tips

1. **Keep MongoDB running** - The services need it!
2. **Check logs** - `docker-compose -f docker-compose.local-mongo.yml logs -f`
3. **Clean restart** - Run `stop-services.bat` then `start-local-mongo.bat`

---

**You're all set! Start building awesome docs! 🚀**
