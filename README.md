# 🌟 Doxify — Beautiful docs, production-ready

[![CI](https://github.com/mihir-rabari/doxify/actions/workflows/ci.yml/badge.svg)](../../actions)
![License](https://img.shields.io/badge/license-MIT-blue)
![Made with TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Dockerized](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

Doxify is a modern documentation platform with a beautiful CMS, MD/MDX parsing, theme customization, and static export — now hardened for production deployment.

---

## ✨ Features

- **🎨 Beautiful CMS Interface** - Supabase-inspired design with intuitive UI
- **📝 MDX Support** - Write with enhanced Markdown (MDX + custom blocks)
- **🔥 Live Preview** - See changes instantly as you type
- **🎨 Theme Customization** - Full control over colors, fonts, and styling
- **📦 Static Export** - Generate production-ready Next.js sites
- **🏗️ Microservices Architecture** - Scalable and maintainable backend
- **🔒 Secure Authentication** - JWT access tokens + refresh rotation (15m/30d)
- **🛡️ Gateway Protections** - Rate limits, CORS allowlist, Helmet, auth guard
- **🐳 Docker Ready** - Multi-stage builds and compose orchestration

## 🏗️ Architecture (High-level)

Doxify uses a microservices architecture:

```
┌─────────────────┐
│   API Gateway   │
│    :4000        │
└────────┬────────┘
         │
    ┌────┴─────────────────┐
    │                      │
┌───▼────┐  ┌────────┐  ┌─────┐
│  Auth  │  │Projects│  │Pages│
│  :4001 │  │ :4002  │  │:4003│
└────────┘  └────────┘  └─────┘
                │          │
┌────────┐   ┌──▼──┐   ┌───▼───┐
│ Parser │   │Theme│   │ Export│
│ :4004  │   │:4005│   │ :4006 │
└────────┘   └─────┘   └───────┘
         │
   ┌─────▼─────┐
   │  MongoDB  │
   │   :27017  │
   └───────────┘
```

## 🚀 Quick Start (Docker)

### Prerequisites

- Docker & Docker Compose

### 1. Clone & Configure

```bash
git clone https://github.com/mihir-rabari/doxify.git
cd doxify
cp .env.example .env
```

### 2. Start Everything

```bash
# Build and start all services (frontend, gateway, microservices, MongoDB)
docker-compose -f docker-compose.production.yml up --build -d

# Tail logs
docker-compose -f docker-compose.production.yml logs -f
```

This starts:
- **Frontend:** http://localhost:3000
- **API Gateway:** http://localhost:4000
- **MongoDB:** Port 27017
- **All 9 microservices**

### 3. Create Your First Project

1. Visit http://localhost:3000/register
2. Create an account
3. Create a new documentation project
4. Start writing in MDX
5. Customize your theme
6. Export as a static site

## 📁 Project Structure

```
doxify/
├── services/              # Microservices
│   ├── api-gateway/      # Main entry point (port 4000)
│   ├── auth-service/     # User authentication (port 4001)
│   ├── projects-service/ # Project management (port 4002)
│   ├── pages-service/    # Page CRUD (port 4003)
│   ├── parser-service/   # MDX parsing (port 4004)
│   ├── theme-service/    # Theme customization (port 4005)
│   └── export-service/   # Static site export (port 4006)
├── apps/
│   └── web/              # Frontend (Vite + React + TypeScript)
├── shared/
│   └── types/            # Shared TypeScript types
├── agents/               # AI context documentation
├── docker-compose.yml    # Docker configuration
├── backend.md            # Backend API documentation
└── README.md             # This file
```

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 20
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB 7
- **Parser:** unified, remark, rehype
- **Authentication:** JWT (jsonwebtoken)
- **Containerization:** Docker

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand + React Query
- **Router:** React Router v6
- **UI Components:** Radix UI
- **Icons:** Lucide React

## 📖 API Surface (via Gateway)

Base URL: `http://localhost:4000`

- Auth: `/api/auth/*`
- Projects: `/api/projects/*`
- Pages: `/api/pages/*`
- Theme: `/api/theme/*`
- Export: `/api/export/*`
- Viewer (public): `/api/view/*`

Rate limit doc: `/api/rate-limits`

## 🔧 Environment Configuration

Copy `.env.example` to `.env` and adjust as needed. Key variables:

```env
# Gateway
JWT_SECRET=change-this-secret
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Auth tokens
JWT_EXPIRES_IN=15m
REFRESH_JWT_SECRET=change-this-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=30d
REFRESH_TOKEN_COOKIE=true

# Frontend
VITE_API_URL=http://localhost:4000
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose -f docker-compose.production.yml up -d

# Stop services
docker-compose -f docker-compose.production.yml down

# View logs
docker-compose -f docker-compose.production.yml logs -f

# Rebuild & restart
docker-compose -f docker-compose.production.yml up --build -d

# Clean reset
docker-compose -f docker-compose.production.yml down -v
```

## 🎨 Default Theme

Doxify uses a Supabase-inspired color palette:

```css
Primary: #3ECF8E (green)
Secondary: #1F1F1F (dark gray)
Background: #FFFFFF (white)
Foreground: #1F1F1F (text)
```

## 🧪 Health & Testing (manual)

```bash
# Health checks
curl -s http://localhost:4000/health | jq
curl -s http://localhost:4000/api/rate-limits | jq
curl -s http://localhost:4001/health | jq  # auth-service
```

Planned:
- Unit tests (Vitest) and E2E (Playwright)

## 🚀 Production Deployment

### Deploy to any VPS (DigitalOcean, AWS, etc.)

```bash
# On your server
git clone https://github.com/mihir-rabari/doxify.git
cd doxify
cp .env.example .env
# Edit .env with production values
docker-compose -f docker-compose.production.yml up --build -d
```

That's it! Your Doxify instance is live.

## 📋 Roadmap

### MVP (Current)
- [x] Backend microservices
- [x] Frontend CMS interface
- [x] MDX parsing
- [x] Theme customization
- [x] Static site export

### Future Features
- [ ] Real-time collaboration (Y.js)
- [ ] AI content generation
- [ ] Global search (MeiliSearch)
- [ ] Version control
- [ ] MCP Server for AI agents
- [ ] GitHub sync
- [ ] Template marketplace
- [ ] Deploy button (one-click Vercel/Netlify)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Mihir Rabari** - Indie Developer

I build tools based on my project needs. If it works for me, I ship it.

---

**Built with ❤️ by an indie developer solving his own problems**
