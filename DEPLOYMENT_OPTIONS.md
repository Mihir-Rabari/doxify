# 🚀 Deployment Options for Doxify

Choose the best setup for your use case!

## 🎯 Quick Comparison

| Method | Speed | Memory | Best For | Internet |
|--------|-------|--------|----------|----------|
| **PM2** | ⚡⚡⚡ Fastest | 💚 Low (200MB) | Development | None |
| **Docker + Local MongoDB** | ⚡⚡ Fast | 💛 Medium (400MB) | Dev + Isolated | None |
| **Full Docker** | ⚡ Slower | 💛 High (800MB) | Production | ~500MB |

---

## 1️⃣ PM2 Setup (Recommended for Development)

### ⚡ Why Choose PM2?

✅ **Fastest startup** - No container overhead  
✅ **Low memory usage** - Native Node.js processes  
✅ **No Docker required** - One less dependency  
✅ **Easy debugging** - Direct access to logs  
✅ **Hot reload** - Restart instantly  
✅ **No internet needed** - Uses local MongoDB  
✅ **Built-in monitoring** - `pm2 monit` is awesome  

### 🚀 Setup

```bash
cd k:/projects/doxify
start-pm2.bat
```

### 📚 Full Guide
See [PM2_SETUP.md](./PM2_SETUP.md)

### 🎯 Perfect For
- Daily development
- Quick prototyping
- Testing features
- Learning the codebase
- Low-spec machines

---

## 2️⃣ Docker with Local MongoDB

### 💡 Why Choose This?

✅ **Isolated services** - Services in containers  
✅ **No MongoDB download** - Uses local MongoDB  
✅ **Consistent environment** - Docker benefits  
✅ **Easy cleanup** - `docker-compose down`  
✅ **No internet needed** - For MongoDB at least  

### 🚀 Setup

```bash
cd k:/projects/doxify
start-local-mongo.bat
```

### 📚 Full Guide
See [LOCAL_MONGO_SETUP.md](./LOCAL_MONGO_SETUP.md)

### 🎯 Perfect For
- Docker fans
- Testing deployments locally
- CI/CD practice
- Multiple projects isolation

---

## 3️⃣ Full Docker Setup

### 🐳 Why Choose This?

✅ **Complete isolation** - Everything containerized  
✅ **Production-like** - Matches deployment  
✅ **Easy sharing** - One command for teammates  
✅ **Volume persistence** - Data survives restarts  

### 🚀 Setup

```bash
cd k:/projects/doxify
docker-compose up --build
```

### 📚 Full Guide
See [SETUP.md](./SETUP.md)

### 🎯 Perfect For
- Production testing
- Team collaboration
- Clean environment needed
- Deployment preparation

---

## 📊 Detailed Comparison

### Startup Time

| Method | First Run | Subsequent Runs |
|--------|-----------|----------------|
| PM2 | ~10 seconds | ~5 seconds |
| Docker + Local MongoDB | ~30 seconds | ~15 seconds |
| Full Docker | ~2 minutes | ~20 seconds |

### Memory Usage

| Method | Total RAM | Per Service |
|--------|-----------|-------------|
| PM2 | ~200MB | ~25MB |
| Docker + Local MongoDB | ~400MB | ~50MB |
| Full Docker | ~800MB | ~100MB |

### Disk Space

| Method | Docker Images | Total Space |
|--------|---------------|-------------|
| PM2 | None | ~500MB (code only) |
| Docker + Local MongoDB | ~200MB | ~700MB |
| Full Docker | ~700MB | ~1.2GB |

---

## 🎯 Recommended Workflow by Scenario

### 👨‍💻 Solo Development
**Use: PM2**
```bash
start-pm2.bat
```
- Fastest
- Easiest to debug
- Lowest resource usage

### 👥 Team Development
**Use: Full Docker**
```bash
docker-compose up --build
```
- Everyone has same environment
- No "works on my machine"
- Easy onboarding

### 🧪 Testing/QA
**Use: Docker + Local MongoDB**
```bash
start-local-mongo.bat
```
- Balance of speed and isolation
- Easy to reset
- Good for testing

### 🚀 Production
**Use: Full Docker or PM2 on server**
```bash
# Docker
docker-compose -f docker-compose.prod.yml up -d

# PM2 (on VPS)
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

---

## 🔄 Switching Between Methods

You can easily switch between methods:

### Stop Current Setup
```bash
# PM2
stop-pm2.bat

# Docker
docker-compose down
# or
stop-services.bat
```

### Start Different Setup
```bash
# Switch to PM2
start-pm2.bat

# Switch to Docker + Local MongoDB
start-local-mongo.bat

# Switch to Full Docker
docker-compose up --build
```

---

## 💡 Pro Tips

### For PM2 Development
1. Use `pm2 logs` in separate terminal
2. Enable `watch: true` in ecosystem.config.js for hot reload
3. Use `pm2 monit` to monitor resources
4. Save your PM2 setup: `pm2 save`

### For Docker Development
1. Use `docker-compose logs -f` to follow logs
2. Rebuild only changed services: `docker-compose up --build auth-service`
3. Clean volumes when testing DB changes: `docker-compose down -v`
4. Use Docker Desktop dashboard for visual monitoring

### For Both
1. Keep MongoDB running all the time
2. Use `.env` files for configuration
3. Check logs first when debugging
4. Monitor memory usage

---

## 🆘 Troubleshooting

### PM2 Issues
```bash
# Reinstall PM2
npm install -g pm2

# Clear PM2 cache
pm2 kill
pm2 start ecosystem.config.js

# View detailed logs
pm2 logs --lines 100
```

### Docker Issues
```bash
# Clean everything
docker-compose down -v
docker system prune -a

# Rebuild from scratch
docker-compose up --build --force-recreate
```

### MongoDB Issues
```bash
# Check status
sc query MongoDB

# Restart
net stop MongoDB
net start MongoDB

# Connect to verify
mongosh mongodb://localhost:27017/doxify
```

---

## 🎓 Learning Curve

| Method | Difficulty | Time to Learn |
|--------|-----------|---------------|
| PM2 | ⭐ Easy | 10 minutes |
| Docker + Local MongoDB | ⭐⭐ Moderate | 30 minutes |
| Full Docker | ⭐⭐⭐ Advanced | 1 hour |

---

## 📋 Checklist: Choose Your Method

Ask yourself:

- [ ] Do I have MongoDB installed locally? → **PM2**
- [ ] Do I need fast iteration speed? → **PM2**
- [ ] Am I on a low-spec machine? → **PM2**
- [ ] Do I want to learn Docker? → **Full Docker**
- [ ] Am I preparing for production? → **Full Docker**
- [ ] Do I want a balance? → **Docker + Local MongoDB**

---

**Can't decide? Start with PM2! It's the fastest way to get going! 🚀**
