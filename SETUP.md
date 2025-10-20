# 🚀 Doxify Setup Guide

This guide will help you get Doxify up and running on your machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Docker Desktop** (with Docker Compose)
- **Node.js 20+** (for frontend development)
- **Git** (to clone the repository)

## Quick Start (Recommended)

### Windows

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mihir-rabari/doxify.git
   cd doxify
   ```

2. **Run the startup script:**
   ```bash
   start.bat
   ```

3. **Open your browser:**
   - Frontend: http://localhost:5173
   - API: http://localhost:4000

### Linux/Mac

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mihir-rabari/doxify.git
   cd doxify
   ```

2. **Make the script executable and run it:**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

3. **Open your browser:**
   - Frontend: http://localhost:5173
   - API: http://localhost:4000

## Manual Setup

If you prefer to start services manually:

### 1. Start Backend Services

```bash
# From project root
docker-compose up --build
```

Wait for all services to start (you'll see logs from each service).

### 2. Start Frontend

```bash
# In a new terminal
cd apps/web

# Install dependencies (first time only)
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

Frontend will be available at http://localhost:5173

## Verify Installation

### Check Backend Services

All services should be running and accessible:

```bash
# API Gateway
curl http://localhost:4000/health

# Auth Service
curl http://localhost:4001/health

# Projects Service
curl http://localhost:4002/health

# Pages Service
curl http://localhost:4003/health

# Parser Service
curl http://localhost:4004/health

# Theme Service
curl http://localhost:4005/health

# Export Service
curl http://localhost:4006/health
```

Each should return: `{"status":"ok","service":"<service-name>"}`

### Check MongoDB

```bash
# Using mongosh (if installed)
mongosh "mongodb://doxify:doxify123@localhost:27017/doxify?authSource=admin"

# Should connect successfully
```

### Check Frontend

Open http://localhost:5173 in your browser. You should see the Doxify login page.

## First Time Setup

1. **Register an account:**
   - Go to http://localhost:5173/register
   - Enter your name, email, and password
   - Click "Create Account"

2. **Create your first project:**
   - Click "New Project" button
   - Enter project name and description
   - Click "Create Project"

3. **Add pages:**
   - Click "New Page" in the sidebar
   - Enter page title
   - Start writing in MDX format

4. **Customize theme:**
   - Click the Settings icon
   - Adjust colors, fonts, and theme settings
   - Click "Save Theme"

5. **Export your site:**
   - Click "Export" button in the editor
   - Download the generated Next.js site
   - Deploy to Vercel, Netlify, or your own hosting

## Stopping Services

### Windows
```bash
docker-compose down
```

### Linux/Mac
```bash
docker-compose down
```

To also remove volumes (reset database):
```bash
docker-compose down -v
```

## Troubleshooting

### Port Already in Use

If you see errors about ports being in use:

**Backend (4000-4006):**
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:4000 | xargs kill -9
```

**Frontend (5173):**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5173 | xargs kill -9
```

### Docker Not Starting

1. Make sure Docker Desktop is running
2. Check Docker status:
   ```bash
   docker info
   ```
3. Restart Docker Desktop if needed

### MongoDB Connection Issues

1. Check if MongoDB container is running:
   ```bash
   docker ps | grep mongodb
   ```

2. View MongoDB logs:
   ```bash
   docker-compose logs mongodb
   ```

3. Restart MongoDB:
   ```bash
   docker-compose restart mongodb
   ```

### Frontend Not Loading

1. Check if dependencies are installed:
   ```bash
   cd apps/web
   npm install
   ```

2. Clear Vite cache:
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

3. Check for TypeScript errors:
   ```bash
   npm run build
   ```

### Services Not Responding

View logs for specific service:
```bash
docker-compose logs -f [service-name]

# Examples:
docker-compose logs -f api-gateway
docker-compose logs -f auth-service
docker-compose logs -f pages-service
```

## Development Tips

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api-gateway

# Last 100 lines
docker-compose logs --tail=100
```

### Restarting Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart auth-service
```

### Rebuilding After Changes

```bash
# Rebuild all services
docker-compose up --build

# Rebuild specific service
docker-compose up --build auth-service
```

### Accessing MongoDB

```bash
# Using Docker exec
docker exec -it doxify-mongodb mongosh -u doxify -p doxify123 --authenticationDatabase admin

# List databases
show dbs

# Use doxify database
use doxify

# List collections
show collections

# Query data
db.users.find()
db.projects.find()
db.pages.find()
```

## Environment Variables

### Backend (Docker)

Set in `docker-compose.yml`:
```yaml
environment:
  - MONGODB_URI=mongodb://doxify:doxify123@mongodb:27017/doxify?authSource=admin
  - JWT_SECRET=your-secret-key
  - JWT_EXPIRES_IN=7d
```

### Frontend

Set in `apps/web/.env`:
```env
VITE_API_URL=http://localhost:4000
VITE_APP_NAME=Doxify
```

## Next Steps

- Read the [Backend API Documentation](./backend.md)
- Explore the [Agent Context Files](./agents/)
- Check out the [Main README](./README.md)
- Start building your documentation!

## Need Help?

- Check the [GitHub Issues](https://github.com/mihir-rabari/doxify/issues)
- Read the [Documentation](./backend.md)
- Review the [PRD](./README.md)

---

**Happy documenting! 🚀**
