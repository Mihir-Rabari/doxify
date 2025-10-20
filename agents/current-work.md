# Current Work

## Active Task: Frontend Development

### What I'm Building Now
Building the Doxify frontend with Vite + React + TypeScript

### Objective
Create a modern, responsive documentation CMS interface that connects to the backend microservices.

### Approach

#### 1. Project Setup
- Use Vite for fast dev experience
- React 18 with TypeScript
- Tailwind CSS for styling
- Supabase-inspired color theme

#### 2. Project Structure
```
apps/web/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Route pages
│   ├── layouts/       # Layout components
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API services
│   ├── store/         # State management
│   ├── types/         # TypeScript types
│   ├── utils/         # Utility functions
│   ├── styles/        # Global styles
│   ├── App.tsx
│   └── main.tsx
```

#### 3. Key Components to Build

**Authentication**
- LoginPage
- RegisterPage
- AuthGuard (protected route wrapper)

**Dashboard**
- ProjectsList
- ProjectCard
- CreateProjectModal

**Editor Workspace**
- EditorLayout (split view)
- Sidebar (page tree)
- MarkdownEditor (main editor)
- LivePreview (rendered preview)

**Theme Customizer**
- ColorPicker
- FontSelector
- ThemePreview

**Common Components**
- Button
- Input
- Modal
- Toast/Notification
- Loading
- Navbar
- Sidebar

#### 4. State Management
- React Context for auth
- React Query for server state
- Local state with useState/useReducer

#### 5. Routing
```
/ - Landing/Dashboard
/login - Login page
/register - Register page
/projects - Projects list
/project/:id - Project workspace
/project/:id/editor/:pageId - Page editor
/project/:id/settings - Project settings
```

#### 6. API Integration
- Axios client with interceptors
- JWT token management
- Error handling
- Loading states

#### 7. Supabase-Inspired Theme
```css
Primary: #3ECF8E (green)
Background: #FFFFFF / #1F1F1F (light/dark)
Text: #1F1F1F / #FFFFFF
Border: #E5E7EB
Accent: #3ECF8E
```

### Current Focus

**Right Now:** Setting up Vite project structure

**Next:**
1. Install dependencies
2. Configure Tailwind CSS
3. Create theme configuration
4. Build auth pages
5. Create API client

### Code Style Guidelines

- Use functional components
- TypeScript strict mode
- Tailwind for all styling (no CSS modules)
- shadcn/ui for complex components
- Lucide React for icons
- Consistent naming (camelCase for functions/variables, PascalCase for components)

### File Naming Convention
- Components: `PascalCase.tsx` (e.g., `ProjectCard.tsx`)
- Hooks: `camelCase.ts` (e.g., `useAuth.ts`)
- Utils: `camelCase.ts` (e.g., `apiClient.ts`)
- Pages: `PascalCase.tsx` (e.g., `Dashboard.tsx`)

### Testing Approach (Later)
- Vitest for unit tests
- Testing Library for component tests
- Playwright for E2E tests

### Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Color contrast (WCAG AA)

### Performance Considerations
- Code splitting with lazy loading
- Optimize bundle size
- Debounce editor saves
- Virtual scrolling for long lists
- Image optimization

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Collapsible sidebar on mobile

### Editor Features
- Syntax highlighting
- Auto-save (debounced)
- Markdown shortcuts
- Live preview sync
- MDX support

### Preview Features
- Real-time rendering
- Scroll sync (optional)
- Theme preview
- Mobile preview toggle

### Integration Points

**Backend APIs:**
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/me` - Get current user
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/pages?projectId=:id` - List pages
- `POST /api/pages` - Create page
- `GET /api/pages/:id` - Get page
- `PUT /api/pages/:id` - Update page
- `DELETE /api/pages/:id` - Delete page
- `GET /api/pages/:id/preview` - Get preview HTML
- `GET /api/theme/:projectId` - Get theme
- `PUT /api/theme/:projectId` - Update theme
- `POST /api/export/build` - Export project

### Dependencies to Install

**Core:**
- react, react-dom
- react-router-dom
- axios
- @tanstack/react-query

**UI:**
- tailwindcss
- lucide-react
- @radix-ui/react-* (via shadcn)
- clsx, tailwind-merge

**Editor:**
- @uiw/react-markdown-editor OR
- @monaco-editor/react OR
- react-codemirror

**Utils:**
- date-fns
- lodash-es
- zustand (optional for state)

**Dev:**
- @types/react
- @types/react-dom
- @types/node
- typescript
- vite
- eslint
- prettier

### Environment Variables
```env
VITE_API_URL=http://localhost:4000
VITE_APP_NAME=Doxify
```

### Git Workflow
- Feature branches
- Commit messages: "feat:", "fix:", "docs:", etc.
- Small, focused commits

### Debug Strategy
- React DevTools
- Network tab for API calls
- Console logs (remove in production)
- Error boundaries for crash handling

### Browser Testing
- Chrome (primary)
- Firefox
- Safari (if available)

---

## Immediate Next Steps

1. ✅ Create Vite project
2. ⏳ Install Tailwind CSS
3. ⏳ Configure theme colors
4. ⏳ Create layout components
5. ⏳ Build auth pages
6. ⏳ Create API client
7. ⏳ Build dashboard
8. ⏳ Create editor workspace

---

**Started:** October 20, 2025  
**Status:** In Progress  
**ETA:** 2-3 days for MVP frontend
