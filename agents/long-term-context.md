# Long-Term Context

## Project Overview

**Doxify** is a documentation creation and site generation platform that combines CMS functionality with MDX parsing and static site export capabilities.

## Architecture Philosophy

### Microservices Design
- Each service has a single responsibility
- Services communicate via REST APIs
- API Gateway acts as single entry point
- Independent scaling and deployment

### Technology Choices
- **Backend:** Express.js microservices (TypeScript)
- **Frontend:** Vite + React (TypeScript)
- **Database:** MongoDB (document-based for flexible schemas)
- **Parser:** unified/remark ecosystem (industry standard)
- **Containerization:** Docker for consistent environments
- **Authentication:** JWT (stateless, scalable)

## Design Patterns

### Backend Patterns
1. **Service-oriented architecture** - Each domain has its own service
2. **Repository pattern** - Mongoose models abstract database
3. **Middleware chain** - Auth, validation, error handling
4. **Proxy pattern** - API Gateway routes to services

### Data Flow
```
User → API Gateway → Microservice → MongoDB → Response
```

### Parser Pipeline
```
MDX Content → remark parse → AST → Blocks → MongoDB
MDX Content → remark parse → rehype → HTML (preview)
```

## Key Decisions

### Why Microservices?
- Scalability: Each service can scale independently
- Maintainability: Clear boundaries between domains
- Technology flexibility: Can use different tech per service
- Fault isolation: One service failure doesn't kill entire system

### Why MongoDB?
- Flexible schema for content blocks
- JSON-like documents match our data structure
- Easy to query nested data (blocks, metadata)
- Good performance for read-heavy workloads

### Why unified/remark?
- Industry standard for Markdown processing
- Extensive plugin ecosystem
- AST-based approach is powerful and flexible
- Used by Next.js, Docusaurus, etc.

## Theme System

### Supabase-Inspired Design
- Primary color: `#3ECF8E` (green accent)
- Dark mode support built-in
- Clean, modern aesthetic
- Focus on readability

### Color Palette
```css
--primary: #3ECF8E (green)
--secondary: #1F1F1F (dark gray)
--background: #FFFFFF (white)
--foreground: #1F1F1F (text)
--accent: #3ECF8E (green)
```

## API Design Principles

1. **RESTful** - Standard HTTP methods
2. **Consistent responses** - Always `{ success, data/message }`
3. **Validation** - express-validator on all inputs
4. **Error handling** - Centralized error middleware
5. **Rate limiting** - Prevent abuse

## Export System

### Generated Structure
- Complete Next.js 14 site (App Router)
- Tailwind CSS for styling
- Static export ready (`next export`)
- Theme config injected as CSS variables
- DocRenderer component for blocks

### Why Next.js?
- Industry standard for React apps
- Built-in static export
- Great SEO capabilities
- Fast performance
- Easy deployment (Vercel, Netlify, etc.)

## Security Considerations

1. **JWT tokens** - Expire after 7 days
2. **Password hashing** - bcrypt with 12 rounds
3. **Rate limiting** - 100 requests per 15 minutes
4. **Input validation** - All user inputs validated
5. **CORS** - Enabled for frontend access

## Scalability Strategy

### Current (MVP)
- Single MongoDB instance
- Docker Compose for orchestration
- Services on same network

### Future
- MongoDB replica set for HA
- Kubernetes for orchestration
- Redis for caching
- Load balancer for API Gateway
- CDN for exported sites

## Development Workflow

1. **Backend first** - Build APIs before UI
2. **Test with curl/Postman** - Verify APIs work
3. **Document as you go** - Keep docs updated
4. **Use TypeScript** - Type safety everywhere
5. **Docker for consistency** - Same env everywhere

## Code Organization

```
doxify/
├── services/           # Microservices
│   ├── api-gateway/   # Entry point
│   ├── auth-service/  # User auth
│   ├── projects-service/
│   ├── pages-service/
│   ├── parser-service/
│   ├── theme-service/
│   └── export-service/
├── shared/            # Shared code
│   └── types/        # TypeScript types
├── apps/             # Applications
│   └── web/          # Frontend (to be built)
├── agents/           # Context for AI
└── docker-compose.yml
```

## Testing Strategy (Future)

1. **Unit tests** - Service logic
2. **Integration tests** - API endpoints
3. **E2E tests** - Full user flows
4. **Load tests** - Performance benchmarks

## Deployment Strategy (Future)

### MVP
- Docker Compose on VPS
- MongoDB Atlas for database
- Domain with SSL

### Production
- Kubernetes cluster
- Managed MongoDB (Atlas)
- CI/CD pipeline (GitHub Actions)
- Monitoring (Prometheus/Grafana)
- Logging (ELK stack)

## User Journey

1. **Sign up** → Create account
2. **Create project** → New documentation project
3. **Add pages** → Write content in MDX
4. **Customize theme** → Brand colors, fonts
5. **Preview** → See live rendering
6. **Export** → Download Next.js site
7. **Deploy** → Vercel/Netlify/Own server

## Content Format

### MDX Support
- Standard Markdown syntax
- Frontmatter metadata
- GFM (tables, task lists, etc.)
- Custom directives (:::note, :::warning)
- Code blocks with syntax highlighting

### Block Structure
Every piece of content becomes a "block":
```javascript
{
  type: "heading" | "paragraph" | "code" | ...,
  content: "The actual content",
  lang: "js" (for code),
  variant: "note" (for callouts),
  meta: { depth: 1, ... }
}
```

This allows:
- Structured storage in DB
- Easy rendering to React components
- Future AI understanding/manipulation

## Performance Targets

- **API response** < 200ms
- **Parser processing** < 500ms per page
- **Export generation** < 5s per project
- **Frontend load** < 1s

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## Dependencies Philosophy

- Use battle-tested libraries
- Avoid unnecessary dependencies
- Keep bundle sizes small
- Regular security updates

## Future Features (Post-MVP)

1. **Real-time collaboration** - Y.js integration
2. **AI content generation** - OpenAI/Claude integration
3. **Search** - MeiliSearch/Algolia
4. **Versioning** - Git-like version control
5. **Comments** - Team feedback
6. **Analytics** - Usage tracking
7. **Templates** - Pre-made structures
8. **Marketplace** - Themes and plugins
9. **MCP Server** - AI agent integration
10. **GitHub sync** - Two-way sync with repos

## Monitoring & Observability (Future)

- Health checks on all services
- Request logging
- Error tracking (Sentry)
- Performance monitoring
- User analytics

## Backup Strategy (Future)

- Daily MongoDB backups
- Retention: 30 days
- Export to S3/Cloud Storage
- Disaster recovery plan

---

This context should persist across sessions and guide all major decisions.
