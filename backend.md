# Doxify Backend Documentation

## 🏗️ Architecture Overview

Doxify uses a **microservices architecture** with the following services:

```
┌─────────────────┐
│   API Gateway   │  :4000 - Main entry point
│   (Port 4000)   │
└────────┬────────┘
         │
    ┌────┴─────────────────────────────────────┐
    │                                           │
┌───▼────┐  ┌──────────┐  ┌──────┐  ┌────────┐  ┌──────┐  ┌────────┐
│  Auth  │  │ Projects │  │Pages │  │ Parser │  │Theme │  │ Export │
│  :4001 │  │  :4002   │  │:4003 │  │ :4004  │  │:4005 │  │ :4006  │
└────────┘  └──────────┘  └──────┘  └────────┘  └──────┘  └────────┘
                │              │                      │         │
                └──────┬───────┴──────────────────────┴─────────┘
                       │
                 ┌─────▼─────┐
                 │  MongoDB  │
                 │   :27017  │
                 └───────────┘
```

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)

### Start All Services
```bash
cd k:/projects/doxify
docker-compose up --build
```

### Stop All Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f [service-name]
```

## 📡 API Endpoints

### Base URL
```
http://localhost:4000
```

---

## 🔐 Auth Service (Port 4001)

### POST `/api/auth/register`
Register a new user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token-here",
    "user": {
      "_id": "user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2025-10-20T10:00:00.000Z",
      "updatedAt": "2025-10-20T10:00:00.000Z"
    }
  }
}
```

### POST `/api/auth/login`
Login user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token-here",
    "user": { ... }
  }
}
```

### GET `/api/auth/me`
Get current user (requires auth header)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

## 📁 Projects Service (Port 4002)

### POST `/api/projects`
Create a new project

**Request:**
```json
{
  "name": "My Documentation",
  "description": "Documentation for my project",
  "userId": "user_id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "project_id",
    "name": "My Documentation",
    "slug": "my-documentation",
    "description": "Documentation for my project",
    "userId": "user_id",
    "theme": {
      "primary": "#3ECF8E",
      "secondary": "#1F1F1F",
      "background": "#FFFFFF",
      "foreground": "#1F1F1F",
      "accent": "#3ECF8E",
      "darkMode": false,
      "font": "Inter",
      "codeTheme": "dracula"
    },
    "createdAt": "2025-10-20T10:00:00.000Z",
    "updatedAt": "2025-10-20T10:00:00.000Z"
  }
}
```

### GET `/api/projects`
Get all projects (with pagination)

**Query Parameters:**
- `userId` (optional) - Filter by user ID
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [ /* array of projects */ ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### GET `/api/projects/:id`
Get single project

### PUT `/api/projects/:id`
Update project

**Request:**
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

### DELETE `/api/projects/:id`
Delete project

---

## 📄 Pages Service (Port 4003)

### POST `/api/pages`
Create a new page

**Request:**
```json
{
  "projectId": "project_id",
  "title": "Getting Started",
  "content": "# Welcome\n\nThis is your getting started guide.",
  "metadata": {
    "sidebarPosition": 1,
    "tags": ["intro", "guide"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "page_id",
    "projectId": "project_id",
    "title": "Getting Started",
    "slug": "/getting-started",
    "content": "# Welcome\n\nThis is your getting started guide.",
    "blocks": [
      {
        "type": "heading",
        "content": "Welcome",
        "meta": { "depth": 1 }
      },
      {
        "type": "paragraph",
        "content": "This is your getting started guide."
      }
    ],
    "metadata": {
      "sidebarPosition": 1,
      "tags": ["intro", "guide"]
    },
    "createdAt": "2025-10-20T10:00:00.000Z",
    "updatedAt": "2025-10-20T10:00:00.000Z"
  }
}
```

### GET `/api/pages`
Get all pages (with pagination)

**Query Parameters:**
- `projectId` (required) - Filter by project ID
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 50)

### GET `/api/pages/:id`
Get single page

### GET `/api/pages/:id/preview`
Get page with rendered HTML

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "page_id",
    "title": "Getting Started",
    "content": "# Welcome...",
    "blocks": [ ... ],
    "html": "<h1>Welcome</h1><p>This is your getting started guide.</p>"
  }
}
```

### PUT `/api/pages/:id`
Update page

**Request:**
```json
{
  "title": "Updated Title",
  "content": "# Updated Content",
  "metadata": {
    "sidebarPosition": 2
  }
}
```

### DELETE `/api/pages/:id`
Delete page

---

## 🔧 Parser Service (Port 4004)

### POST `/api/parser/parse`
Parse markdown/MDX content to structured blocks

**Request:**
```json
{
  "content": "# Hello World\n\nThis is a paragraph.\n\n```js\nconsole.log('Hello');\n```",
  "format": "mdx"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "metadata": {},
    "blocks": [
      {
        "type": "heading",
        "content": "Hello World",
        "meta": { "depth": 1 }
      },
      {
        "type": "paragraph",
        "content": "This is a paragraph."
      },
      {
        "type": "code",
        "content": "console.log('Hello');",
        "lang": "js"
      }
    ],
    "raw": "# Hello World\n\nThis is a paragraph.\n\n```js\nconsole.log('Hello');\n```"
  }
}
```

### POST `/api/parser/render`
Render markdown/MDX to HTML

**Request:**
```json
{
  "content": "# Hello World\n\nThis is a paragraph.",
  "format": "mdx"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "html": "<h1>Hello World</h1>\n<p>This is a paragraph.</p>"
  }
}
```

---

## 🎨 Theme Service (Port 4005)

### GET `/api/theme/:projectId`
Get theme for a project

**Response:**
```json
{
  "success": true,
  "data": {
    "primary": "#3ECF8E",
    "secondary": "#1F1F1F",
    "background": "#FFFFFF",
    "foreground": "#1F1F1F",
    "accent": "#3ECF8E",
    "darkMode": false,
    "font": "Inter",
    "codeTheme": "dracula"
  }
}
```

### PUT `/api/theme/:projectId`
Update theme for a project

**Request:**
```json
{
  "primary": "#00B37E",
  "darkMode": true,
  "codeTheme": "nord"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "primary": "#00B37E",
    "secondary": "#1F1F1F",
    "background": "#FFFFFF",
    "foreground": "#1F1F1F",
    "accent": "#3ECF8E",
    "darkMode": true,
    "font": "Inter",
    "codeTheme": "nord"
  }
}
```

---

## 📦 Export Service (Port 4006)

### POST `/api/export/build`
Build and export project as static Next.js site

**Request:**
```json
{
  "projectId": "project_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Project exported successfully",
  "data": {
    "path": "/app/export/my-documentation",
    "downloadUrl": "/api/export/download/project_id"
  }
}
```

### GET `/api/export/download/:projectId`
Download exported project as ZIP file

**Response:**
Binary ZIP file download

---

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Projects Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  slug: String (unique, required),
  description: String,
  userId: String (required, indexed),
  theme: {
    primary: String,
    secondary: String,
    background: String,
    foreground: String,
    accent: String,
    darkMode: Boolean,
    font: String,
    codeTheme: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Pages Collection
```javascript
{
  _id: ObjectId,
  projectId: String (required, indexed),
  title: String (required),
  slug: String (required),
  content: String,
  blocks: [{
    type: String,
    content: String,
    lang: String,
    variant: String,
    meta: Object
  }],
  metadata: {
    sidebarPosition: Number,
    tags: [String],
    description: String,
    author: String
  },
  createdAt: Date,
  updatedAt: Date
}

// Compound index: { projectId: 1, slug: 1 } (unique)
```

---

## 🔒 Authentication

### JWT Token
All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Payload
```json
{
  "userId": "user_id",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Environment Variables
```env
JWT_SECRET=doxify-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

---

## 📝 Supported Block Types

The parser recognizes these block types:

- `heading` - H1-H6 headings
- `paragraph` - Text paragraphs
- `code` - Code blocks with syntax highlighting
- `blockquote` - Quoted text
- `list` - Ordered/unordered lists
- `note` - Info callout (:::note)
- `warning` - Warning callout (:::warning)
- `info` - Info callout (:::info)
- `danger` - Danger callout (:::danger)
- `image` - Images
- `link` - Hyperlinks
- `table` - Tables

---

## 🐳 Docker Services

### MongoDB
- **Port:** 27017
- **Credentials:**
  - Username: `doxify`
  - Password: `doxify123`
- **Database:** `doxify`

### Service Ports
- API Gateway: 4000
- Auth Service: 4001
- Projects Service: 4002
- Pages Service: 4003
- Parser Service: 4004
- Theme Service: 4005
- Export Service: 4006

---

## 🔧 Development

### Local Development Without Docker

Each service can be run independently:

```bash
cd services/auth-service
npm install
npm run dev
```

Repeat for each service.

### Environment Variables

Create `.env` files in each service directory:

**Auth Service:**
```env
PORT=4001
MONGODB_URI=mongodb://doxify:doxify123@localhost:27017/doxify?authSource=admin
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

**Projects/Pages/Theme/Export Services:**
```env
PORT=400X
MONGODB_URI=mongodb://doxify:doxify123@localhost:27017/doxify?authSource=admin
```

**Parser Service:**
```env
PORT=4004
```

**API Gateway:**
```env
PORT=4000
AUTH_SERVICE_URL=http://localhost:4001
PROJECTS_SERVICE_URL=http://localhost:4002
PAGES_SERVICE_URL=http://localhost:4003
PARSER_SERVICE_URL=http://localhost:4004
THEME_SERVICE_URL=http://localhost:4005
EXPORT_SERVICE_URL=http://localhost:4006
```

---

## 📊 API Response Format

### Success Response
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
  "error": "Detailed error (dev only)"
}
```

### Validation Error Response
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Invalid email address",
      "param": "email",
      "location": "body"
    }
  ]
}
```

---

## 🚦 Rate Limiting

API Gateway implements rate limiting:
- **Window:** 15 minutes
- **Max Requests:** 100 per IP
- **Message:** "Too many requests from this IP, please try again later."

---

## 📤 Export Structure

Exported projects generate a complete Next.js site:

```
my-documentation/
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── README.md
├── config/
│   └── theme.json
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── [slug]/
│       └── page.tsx
└── components/
    └── DocRenderer.tsx
```

---

## 🛠️ Tech Stack

- **Runtime:** Node.js 20
- **Framework:** Express.js
- **Database:** MongoDB 7
- **Language:** TypeScript
- **Parser:** unified, remark, rehype
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** express-validator
- **Containerization:** Docker

---

## 🔍 Testing Endpoints

### Health Checks
```bash
# Gateway
curl http://localhost:4000/health

# Individual services
curl http://localhost:4001/health  # Auth
curl http://localhost:4002/health  # Projects
curl http://localhost:4003/health  # Pages
curl http://localhost:4004/health  # Parser
curl http://localhost:4005/health  # Theme
curl http://localhost:4006/health  # Export
```

### Example Flow
```bash
# 1. Register user
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# 2. Create project
curl -X POST http://localhost:4000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"My Docs","userId":"USER_ID"}'

# 3. Create page
curl -X POST http://localhost:4000/api/pages \
  -H "Content-Type: application/json" \
  -d '{"projectId":"PROJECT_ID","title":"Intro","content":"# Hello"}'

# 4. Export project
curl -X POST http://localhost:4000/api/export/build \
  -H "Content-Type: application/json" \
  -d '{"projectId":"PROJECT_ID"}'
```

---

## 📚 Next Steps

- Frontend: React + Vite (Port 5173)
- MCP Server: AI integration layer
- WebSocket: Real-time collaboration
- Search: MeiliSearch integration

---

**Generated:** October 2025  
**Version:** 1.0.0  
**Author:** Mihir Kanubhai Rabari
