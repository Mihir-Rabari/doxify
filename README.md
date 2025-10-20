# 🚀 Doxify

**Build, edit, and deploy stunning documentation — powered by MDX, theme control, and AI.**

Doxify is a modern documentation creation and site generation platform that combines CMS functionality with MDX parsing and static site export capabilities.

![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- **🎨 Beautiful CMS Interface** - Supabase-inspired design with intuitive UI
- **📝 MDX Support** - Write with enhanced Markdown (MDX + custom blocks)
- **🔥 Live Preview** - See changes instantly as you type
- **🎨 Theme Customization** - Full control over colors, fonts, and styling
- **📦 Static Export** - Generate production-ready Next.js sites
- **🏗️ Microservices Architecture** - Scalable and maintainable backend
- **🔒 Secure Authentication** - JWT-based user management
- **🐳 Docker Ready** - One-command deployment with Docker Compose

## 🏗️ Architecture

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

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)

### 1. Clone the Repository

```bash
git clone https://github.com/mihir-rabari/doxify.git
cd doxify
```

### 2. Start Backend & Frontend

#### **Option A: PM2 (Recommended for Development - Fastest!)** ⚡
```bash
start-pm2.bat
```
✅ No Docker needed  
✅ Uses local MongoDB  
✅ Auto-installs dependencies  
✅ Starts everything in one command  
👉 **Skip to step 4** - Everything is ready!

#### **Option B: Docker with Local MongoDB (If PM2 not preferred)**
```bash
start-local-mongo.bat
```
👉 **Skip to step 4** (frontend starts automatically)

#### **Option C: Docker with MongoDB Container (Downloads ~500MB)**
```bash
docker-compose up --build
```

This will start:
- MongoDB (Local/Docker)
- API Gateway on port 4000
- All microservices (Auth, Projects, Pages, Parser, Theme, Export)
- Frontend (PM2 only)

### 3. Start Frontend

```bash
cd apps/web
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`

### 4. Create Your First Project

1. Register an account at `http://localhost:5173/register`
2. Login and create a new documentation project
3. Add pages and start writing in MDX
4. Customize your theme
5. Export as a Next.js static site

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

## 📖 Documentation

- **[PM2 Setup](./PM2_SETUP.md)** - 🚀 **Recommended for development** - Fast, no Docker!
- **[Backend API Documentation](./backend.md)** - Complete API reference
- **[Setup Guide](./SETUP.md)** - Detailed installation & troubleshooting
- **[Local MongoDB Setup](./LOCAL_MONGO_SETUP.md)** - Use local MongoDB (saves bandwidth!)
- **[Quick Reference](./QUICK_REFERENCE.md)** - Commands cheat sheet
- **[Agent Context](./agents/)** - AI development context files

## 🔧 Development

### Backend Development (Without Docker)

Each service can be run independently:

```bash
cd services/auth-service
npm install
npm run dev
```

Repeat for each service. Make sure MongoDB is running on port 27017.

### Frontend Development

```bash
cd apps/web
npm install
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env` in `apps/web`:

```bash
cd apps/web
cp .env.example .env
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up

# Start with rebuild
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Remove volumes (clean reset)
docker-compose down -v
```

## 📝 API Endpoints

### Base URL: `http://localhost:4000`

- **Auth:** `/api/auth/*`
- **Projects:** `/api/projects/*`
- **Pages:** `/api/pages/*`
- **Parser:** `/api/parser/*`
- **Theme:** `/api/theme/*`
- **Export:** `/api/export/*`

See [backend.md](./backend.md) for complete API documentation.

## 🎨 Default Theme

Doxify uses a Supabase-inspired color palette:

```css
Primary: #3ECF8E (green)
Secondary: #1F1F1F (dark gray)
Background: #FFFFFF (white)
Foreground: #1F1F1F (text)
```

## 🧪 Testing

Coming soon:
- Unit tests with Vitest
- Integration tests
- E2E tests with Playwright

## 🚀 Deployment

### Frontend
Deploy to Vercel, Netlify, or any static hosting:

```bash
cd apps/web
npm run build
```

### Backend
Deploy with Docker to any VPS or cloud provider:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Exported Sites
Generated Next.js sites can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any Node.js hosting

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

**Mihir Kanubhai Rabari**

## 🙏 Acknowledgments

- Inspired by Docusaurus, Notion, and Supabase
- Built with amazing open-source tools
- Special thanks to the unified/remark ecosystem

---

**Built with ❤️ by Mihir Rabari**
