# Doxify - Documentation Platform

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Cloud account
- Firebase project with Firestore

### Environment Setup
```bash
# Install dependencies
npm install

# Copy .env.example to .env and configure
cp .env.example .env
```

### Running Locally
```bash
# Start all services
npm run dev

# Or start individual services
cd services/auth-service && npm run dev
```

## ☁️ Deployment

### 1. GCP Project Setup
```bash
# Login to GCP
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable firestore.googleapis.com
```

### 2. Deploy to Cloud Run
```powershell
# Set environment variables
$env:GCP_PROJECT_ID="your-project-id"
$env:JWT_SECRET="your-jwt-secret"

# Run deployment script
.\deploy-gcp.ps1
```

## 🔧 Configuration

### Required Environment Variables
```env
# Server
PORT=4000
NODE_ENV=production

# GCP
GCP_PROJECT_ID=your-project-id

# Security
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

## 📚 Services

| Service | Port | Description |
|---------|------|-------------|
| API Gateway | 4000 | Entry point for all requests |
| Auth | 4001 | Authentication & users |
| Projects | 4002 | Project management |
| Pages | 4003 | Page content |
| Parser | 4004 | Markdown parsing |
| Theme | 4005 | Theme management |
| Export | 4006 | PDF/HTML export |
| Viewer | 4007 | Public docs viewer |
| MCP | 4008 | Content processing |

## 🔄 Development

### Scripts
```json
{
  "dev": "concurrently \"npm run dev:api\" \"npm run dev:web\"",
  "build": "npm run build --workspaces",
  "test": "npm test --workspaces"
}
```

## 📦 Project Structure
```
.
├── services/          # Microservices
├── shared/            # Shared libraries
├── apps/              # Frontend applications
├── scripts/           # Utility scripts
└── deploy-gcp.ps1     # Deployment script
```

## 🔒 Security
- JWT authentication
- Rate limiting
- Input validation
- CORS configuration

## 📄 License
MIT

---

For detailed development guides, see the [wiki](https://github.com/yourusername/doxify/wiki).
