# 📋 Doxify Quick Reference

## 🚀 Starting Doxify

### Windows
```bash
start.bat
```

### Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

## 🔗 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | Main application |
| API Gateway | http://localhost:4000 | Backend API |
| Auth Service | http://localhost:4001 | Authentication |
| Projects | http://localhost:4002 | Project management |
| Pages | http://localhost:4003 | Page management |
| Parser | http://localhost:4004 | MDX parsing |
| Theme | http://localhost:4005 | Theme customization |
| Export | http://localhost:4006 | Site export |
| MongoDB | mongodb://localhost:27017 | Database |

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up

# Start with rebuild
docker-compose up --build

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f [service-name]

# Restart service
docker-compose restart [service-name]

# Check running containers
docker ps
```

## 📝 API Endpoints

### Authentication
```bash
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Projects
```bash
POST   /api/projects
GET    /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
```

### Pages
```bash
POST   /api/pages
GET    /api/pages?projectId=:id
GET    /api/pages/:id
GET    /api/pages/:id/preview
PUT    /api/pages/:id
DELETE /api/pages/:id
```

### Theme
```bash
GET /api/theme/:projectId
PUT /api/theme/:projectId
```

### Export
```bash
POST /api/export/build
GET  /api/export/download/:projectId
```

### Parser
```bash
POST /api/parser/parse
POST /api/parser/render
```

## 🧪 Testing Endpoints

```bash
# Health checks
curl http://localhost:4000/health
curl http://localhost:4001/health

# Register user
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Get projects (with auth token)
curl http://localhost:4000/api/projects?userId=USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📁 File Locations

```
doxify/
├── services/              # Backend microservices
│   ├── api-gateway/      # Port 4000
│   ├── auth-service/     # Port 4001
│   ├── projects-service/ # Port 4002
│   ├── pages-service/    # Port 4003
│   ├── parser-service/   # Port 4004
│   ├── theme-service/    # Port 4005
│   └── export-service/   # Port 4006
├── apps/web/             # Frontend (Port 5173)
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Route pages
│   │   ├── services/    # API services
│   │   ├── store/       # State management
│   │   └── types/       # TypeScript types
│   └── package.json
├── shared/types/         # Shared types
├── agents/               # AI context
└── docker-compose.yml    # Docker config
```

## 🎨 Default Theme Colors

```css
Primary:    #3ECF8E  /* Green accent */
Secondary:  #1F1F1F  /* Dark gray */
Background: #FFFFFF  /* White */
Foreground: #1F1F1F  /* Text */
Accent:     #3ECF8E  /* Green */
```

## 💾 MongoDB Access

### Using Docker
```bash
docker exec -it doxify-mongodb mongosh \
  -u doxify -p doxify123 \
  --authenticationDatabase admin
```

### Commands
```javascript
// Show databases
show dbs

// Use doxify database
use doxify

// Show collections
show collections

// Query data
db.users.find().pretty()
db.projects.find().pretty()
db.pages.find().pretty()

// Count documents
db.users.countDocuments()
db.projects.countDocuments()
db.pages.countDocuments()
```

## 🔧 Development

### Backend (Individual Service)
```bash
cd services/auth-service
npm install
npm run dev
```

### Frontend
```bash
cd apps/web
npm install
npm run dev
```

### Build Frontend
```bash
cd apps/web
npm run build
```

### Lint Frontend
```bash
cd apps/web
npm run lint
```

## 📦 Install Dependencies

### All Backend Services
```bash
# Each service directory
cd services/[service-name]
npm install
```

### Frontend
```bash
cd apps/web
npm install
```

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :4000  # Windows
lsof -i :4000                 # Mac/Linux

# Kill process
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # Mac/Linux
```

### Docker Issues
```bash
# Check Docker is running
docker info

# View container logs
docker logs doxify-api-gateway

# Restart container
docker restart doxify-api-gateway

# Remove all containers and start fresh
docker-compose down -v
docker-compose up --build
```

### Clear Frontend Cache
```bash
cd apps/web
rm -rf node_modules/.vite
npm run dev
```

## 📚 Documentation Links

- [Main README](./README.md) - Project overview
- [Backend API](./backend.md) - Complete API docs
- [Setup Guide](./SETUP.md) - Installation guide
- [Project Summary](./PROJECT_SUMMARY.md) - What's built

## 🎯 Common Tasks

### Create a New User
1. Go to http://localhost:5173/register
2. Fill in name, email, password
3. Click "Create Account"

### Create a Project
1. Login to dashboard
2. Click "New Project"
3. Enter name and description
4. Click "Create Project"

### Add a Page
1. Open project workspace
2. Click "New Page" in sidebar
3. Enter page title
4. Start writing in editor

### Export Project
1. Open project workspace
2. Click "Export" button
3. Wait for build to complete
4. Download ZIP file
5. Extract and deploy

### Change Theme
1. Open project settings
2. Adjust color, font, code theme
3. Toggle dark mode if needed
4. Click "Save Theme"

## 🚨 Important Notes

- **MongoDB Credentials:** doxify / doxify123
- **JWT Secret:** Change in production!
- **Token Expiry:** 7 days by default
- **Rate Limit:** 100 requests per 15 minutes
- **Max Upload:** 10MB for content

## 🔐 Environment Variables

### Backend (.env or docker-compose.yml)
```env
MONGODB_URI=mongodb://doxify:doxify123@mongodb:27017/doxify?authSource=admin
JWT_SECRET=doxify-secret-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=400X
```

### Frontend (apps/web/.env)
```env
VITE_API_URL=http://localhost:4000
VITE_APP_NAME=Doxify
```

## ⚡ Performance Tips

1. **Use pagination** for large project/page lists
2. **Debounce editor** saves to avoid excessive API calls
3. **Use React Query** cache for repeated data
4. **Enable Docker BuildKit** for faster builds
5. **Use production builds** for deployment

## 🎓 Learning Resources

### MDX Syntax
```markdown
# Heading 1
## Heading 2

**bold** *italic*

- List item
- List item

```javascript
code block
```

:::note
Custom note block
:::

:::warning
Warning block
:::
```

### API Response Format
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error"
}
```

---

**Need more help? Check [SETUP.md](./SETUP.md) for detailed troubleshooting!**
