# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

- Bootstrap all workspaces
  - npm install

- Local development
  - API Gateway (http://localhost:4000)
    - npm -w @doxify/api-gateway run dev
  - Core services (each runs on its own port)
    - npm -w @doxify/auth-service run dev
    - npm -w @doxify/projects-service run dev
    - npm -w @doxify/pages-service run dev
    - npm -w @doxify/parser-service run dev
    - npm -w @doxify/theme-service run dev
    - npm -w @doxify/export-service run dev
    - npm -w viewer-service run dev
    - npm -w @doxify/mcp-service run dev
  - Frontend (http://localhost:5173)
    - npm -w @doxify/web run dev

- Build
  - API Gateway: npm -w @doxify/api-gateway run build
  - Services: replace <svc> with a package name, e.g. @doxify/pages-service
    - npm -w <svc> run build
  - Frontend: npm -w @doxify/web run build
  - Shared types: npm -w @doxify/types run build

- Lint
  - Frontend only: npm -w @doxify/web run lint

- Docker (production-style stack)
  - Up (build): docker-compose -f docker-compose.production.yml up --build -d
  - Logs: docker-compose -f docker-compose.production.yml logs -f
  - Down: docker-compose -f docker-compose.production.yml down
  - Clean reset: docker-compose -f docker-compose.production.yml down -v

- Health checks (useful during dev)
  - Gateway: curl http://localhost:4000/health
  - Rate limits doc: curl http://localhost:4000/api/rate-limits

- Tests
  - No test scripts are defined yet in this repo; running a single test is not applicable.

## High-level architecture and flow

- Frontend (apps/web)
  - React + Vite + TypeScript. Uses Axios client in src/services/api.ts with Authorization Bearer token injection and 401 redirect to /login.
  - Calls the API Gateway at VITE_API_URL (defaults to http://localhost:4000). In dev, Vite proxies /api → http://localhost:4000.
  - Feature areas include the MDX-like editor (src/components/Editor/*), docs viewer (src/components/docs/*), and service wrappers (src/services/*). State via React Query and a small Zustand store.

- API Gateway (services/api-gateway)
  - Express reverse proxy to backend microservices: /api/auth, /api/projects, /api/pages, /api/parser, /api/theme, /api/export, /api/view.
  - Centralized rate limiting in src/config/rateLimits.ts with per-surface policies (search, page edit, auth, read/write, export, parser, theme). Exposes a self-documenting endpoint at /api/rate-limits.

- Microservices (services/*)
  - Language: TypeScript with per-package tsc builds; dev via nodemon/ts-node-dev.
  - Persistence: MongoDB (configured via MONGODB_URI). Auth uses JWT (JWT_SECRET).
  - Responsibilities:
    - auth-service: registration/login/me, bcrypt + JWT.
    - projects-service: project CRUD and publishing.
    - pages-service: page CRUD, preview; integrates with parser-service.
    - parser-service: MD/MDX parsing and rendering using unified/remark/rehype. Key modules:
      - src/lib/parser.ts → returns structured blocks + frontmatter metadata.
      - src/lib/renderer.ts → transforms directives and renders to HTML.
    - theme-service: theme CRUD.
    - export-service: static export and archiving (fs-extra, archiver).
    - viewer-service: public read endpoints for published docs.
    - mcp-service: HTTP MCP server exposing tools for AI agents (see services/mcp-service/README.md for endpoints and tool catalog).

- Shared types (shared/types)
  - TypeScript types package consumed by services and app.

- Deployment notes
  - docker-compose.production.yml builds a multi-service stack: MongoDB, API Gateway (4000), services (4001–4008), and production frontend (3000).
  - Dockerfile uses multi-stage builds (frontend-builder, runner). The runner stage launches Node on services/*/index.js. Ensure services are compiled to JS outputs expected by the container (or update the Dockerfile/compose to run tsc for each service).

## Conventions and important details

- API shape
  - Many backend responses are wrapped as { success, data, pagination? }. Frontend service wrappers unwrap into { data, pagination } where needed (see apps/web/src/services/projectService.ts and pageService.ts).

- Auth
  - JWT token is stored in localStorage (key: token). Axios interceptor attaches Authorization and handles 401 by clearing storage and redirecting to /login.

- Service base paths (through Gateway)
  - /api/auth/*, /api/projects/*, /api/pages/*, /api/parser/*, /api/theme/*, /api/export/*, /api/view/*.

- Environment variables
  - Frontend: VITE_API_URL.
  - Services: MONGODB_URI; auth-service additionally uses JWT_SECRET and JWT_EXPIRES_IN.

- Useful URLs
  - Dev frontend: http://localhost:5173
  - Dev API Gateway: http://localhost:4000
  - Prod-style (compose) frontend: http://localhost:3000

- Rate limiting
  - High-volume: search (100/min), page edits (500/15m). Strict: auth (10/15m). Defaults in src/config/rateLimits.ts; update both the limiter config and the /api/rate-limits doc when changing.
