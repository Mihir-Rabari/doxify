import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import { createProxyMiddleware } from 'http-proxy-middleware';
import {
  searchLimiter,
  pageEditLimiter,
  authLimiter,
  readLimiter,
  writeLimiter,
  exportLimiter,
  parserLimiter,
  standardLimiter,
  themeLimiter
} from './config/rateLimits';
import { authGuard } from './middleware/auth';
import { csrfGuard } from './middleware/csrf';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// CORS allowlist from env (comma-separated)
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser clients
    if (ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
};

// Middleware
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors(corsOptions));
app.use(hpp());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Service URLs
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:4001';
const PROJECTS_SERVICE_URL = process.env.PROJECTS_SERVICE_URL || 'http://localhost:4002';
const PAGES_SERVICE_URL = process.env.PAGES_SERVICE_URL || 'http://localhost:4003';
const PARSER_SERVICE_URL = process.env.PARSER_SERVICE_URL || 'http://localhost:4004';
const THEME_SERVICE_URL = process.env.THEME_SERVICE_URL || 'http://localhost:4005';
const EXPORT_SERVICE_URL = process.env.EXPORT_SERVICE_URL || 'http://localhost:4006';
const VIEWER_SERVICE_URL = process.env.VIEWER_SERVICE_URL || 'http://localhost:4007';

// Helper to preserve rate limit headers on proxied responses
const RATE_HEADERS = [
  'ratelimit-limit',
  'ratelimit-remaining',
  'ratelimit-reset',
  'x-ratelimit-limit',
  'x-ratelimit-remaining',
  'x-ratelimit-reset',
];
function applyRateHeaders(res: any) {
  for (const h of RATE_HEADERS) {
    const current = res.getHeader(h);
    if (current != null) {
      res.setHeader(h, current as string);
    }
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
  });
});

// CSRF token issuance (double-submit cookie)
app.get('/csrf-token', (req, res) => {
  const CSRF_ENABLED = (process.env.CSRF_ENABLED || 'true') !== 'false';
  if (!CSRF_ENABLED) return res.json({ success: true, csrf: null, enabled: false });
  const token = crypto.randomBytes(24).toString('hex');
  const isProd = (process.env.NODE_ENV || 'development') === 'production';
  res.cookie('csrfToken', token, {
    httpOnly: false,
    secure: isProd,
    sameSite: isProd ? 'lax' : 'lax',
    path: '/',
  });
  res.json({ success: true, csrf: token, enabled: true });
});

app.get('/', (req, res) => {
  res.json({
    name: 'Doxify API Gateway',
    version: '1.0.0',
    description: 'Central API gateway for Doxify microservices with dynamic rate limiting and auth',
    services: {
      auth: '/api/auth',
      projects: '/api/projects',
      pages: '/api/pages',
      parser: '/api/parser',
      theme: '/api/theme',
      export: '/api/export',
      viewer: '/api/view',
    },
    rateLimits: {
      search: '100 req/min',
      pageEdit: '500 req/15min',
      auth: '10 req/15min',
      read: '200 req/5min',
      write: '50 req/10min',
      export: '10 req/hour',
      parser: '30 req/10min',
      theme: '20 req/30min',
      standard: '150 req/15min'
    },
    docs: '/api/rate-limits'
  });
});

// Rate limit documentation endpoint
app.get('/api/rate-limits', (req, res) => {
  res.json({
    title: 'Dynamic Rate Limiting Configuration',
    description: 'Service-specific rate limits optimized for production',
    limits: [
      {
        service: 'Search',
        endpoint: '/api/pages/projects/:id/search',
        window: '1 minute',
        maxRequests: 100,
        reason: 'High-volume read operations, user search queries'
      },
      {
        service: 'Page Editing',
        endpoint: '/api/pages/:pageId (PUT/PATCH)',
        window: '15 minutes',
        maxRequests: 500,
        reason: 'Auto-save every 2 seconds during editing'
      },
      {
        service: 'Authentication',
        endpoint: '/api/auth/login, /register',
        window: '15 minutes',
        maxRequests: 10,
        reason: 'Security: prevent brute force attacks'
      },
      {
        service: 'Read Operations',
        endpoint: 'GET requests',
        window: '5 minutes',
        maxRequests: 200,
        reason: 'Standard data fetching'
      },
      {
        service: 'Write Operations',
        endpoint: 'POST/PUT/DELETE requests',
        window: '10 minutes',
        maxRequests: 50,
        reason: 'Data modification operations'
      },
      {
        service: 'Export',
        endpoint: '/api/export',
        window: '1 hour',
        maxRequests: 10,
        reason: 'Resource-intensive document generation'
      },
      {
        service: 'Parser',
        endpoint: '/api/parser',
        window: '10 minutes',
        maxRequests: 30,
        reason: 'CPU-intensive markdown/content parsing'
      },
      {
        service: 'Theme',
        endpoint: '/api/theme',
        window: '30 minutes',
        maxRequests: 20,
        reason: 'Infrequent theme customization operations'
      },
      {
        service: 'Standard (Fallback)',
        endpoint: 'All other endpoints',
        window: '15 minutes',
        maxRequests: 150,
        reason: 'Default rate limit for uncategorized endpoints'
      }
    ],
    headers: {
      'RateLimit-Limit': 'Maximum requests allowed in window',
      'RateLimit-Remaining': 'Requests remaining in current window',
      'RateLimit-Reset': 'Time when limit resets (Unix timestamp)',
    },
    status429: {
      message: 'Rate limit exceeded',
      retryAfter: 'Seconds to wait before retry',
      limit: 'Current rate limit value',
      window: 'Time window for limit'
    }
  });
});

// ===============================
// Auth + CSRF guards
// ===============================
app.use(authGuard);
app.use(csrfGuard);

// ============================================
// DYNAMIC RATE LIMITING BY SERVICE & OPERATION
// ============================================

// 1. AUTH SERVICE - Strict security limits
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
app.use('/api/auth', standardLimiter); // Other auth endpoints

// 2. SEARCH SERVICE - High volume read operations
app.use('/api/pages/projects/:projectId/search', searchLimiter);

// 3. EXPORT SERVICE - Resource intensive
app.use('/api/export', exportLimiter);

// 4. PARSER SERVICE - CPU intensive  
app.use('/api/parser', parserLimiter);

// 5. THEME SERVICE - Infrequent operations
app.use('/api/theme', themeLimiter);

// 6. PROJECTS SERVICE - Mix of read/write
app.use('/api/projects/:projectId', (req, res, next) => {
  // Write operations (create, update, delete)
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE') {
    return writeLimiter(req, res, next);
  }
  // Read operations (get, list)
  return readLimiter(req, res, next);
});
app.use('/api/projects', (req, res, next) => {
  if (req.method === 'POST') {
    return writeLimiter(req, res, next);
  }
  return readLimiter(req, res, next);
});

app.use(
  '/api/auth',
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req: any, res) => {
      console.log(`🟢 [GATEWAY] ${req.method} ${req.url} -> ${AUTH_SERVICE_URL}`);
      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);
        console.log('🟢 [GATEWAY] Request body:', bodyData);
        
        // Write body to proxy request (don't call end(), let proxy handle it)
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`🟢 [GATEWAY] Response from auth: ${proxyRes.statusCode}`);
      applyRateHeaders(res);
    },
    onError: (err, req, res) => {
      console.error('❌ [GATEWAY] Auth service error:', err.message);
      console.error('❌ [GATEWAY] Error details:', err);
      (res as any).status(503).json({
        success: false,
        message: 'Auth service unavailable',
      });
    },
  })
);

app.use(
  '/api/projects',
  createProxyMiddleware({
    target: PROJECTS_SERVICE_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req: any, res) => {
      console.log(`[Projects] ${req.method} ${req.url}`);
      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
      // pass user headers
      if (req.headers['x-user-id']) proxyReq.setHeader('x-user-id', req.headers['x-user-id'] as string);
      if (req.headers['x-user-email']) proxyReq.setHeader('x-user-email', req.headers['x-user-email'] as string);
    },
    onProxyRes: (proxyRes, req, res) => {
      applyRateHeaders(res);
    },
    onError: (err, req, res) => {
      console.error('Projects service error:', err.message);
      (res as any).status(503).json({
        success: false,
        message: 'Projects service unavailable',
      });
    },
  })
);

// 7. PAGES SERVICE - High frequency auto-save + reads
// Page updates (auto-save) - Very high limit
app.use('/api/pages/:pageId', (req, res, next) => {
  if (req.method === 'PUT' || req.method === 'PATCH') {
    return pageEditLimiter(req, res, next); // 500 per 15 min
  }
  if (req.method === 'DELETE') {
    return writeLimiter(req, res, next);
  }
  return readLimiter(req, res, next);
});

// Other pages operations
app.use('/api/pages', (req, res, next) => {
  if (req.method === 'POST') {
    return writeLimiter(req, res, next);
  }
  return readLimiter(req, res, next);
});

app.use(
  '/api/pages',
  createProxyMiddleware({
    target: PAGES_SERVICE_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req: any, res) => {
      console.log(`[Pages] ${req.method} ${req.url}`);
      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
      if (req.headers['x-user-id']) proxyReq.setHeader('x-user-id', req.headers['x-user-id'] as string);
      if (req.headers['x-user-email']) proxyReq.setHeader('x-user-email', req.headers['x-user-email'] as string);
    },
    onProxyRes: (proxyRes, req, res) => {
      applyRateHeaders(res);
    },
    onError: (err, req, res) => {
      console.error('Pages service error:', err.message);
      (res as any).status(503).json({
        success: false,
        message: 'Pages service unavailable',
      });
    },
  })
);

app.use(
  '/api/parser',
  createProxyMiddleware({
    target: PARSER_SERVICE_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req: any, res) => {
      console.log(`[Parser] ${req.method} ${req.url}`);
      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
      if (req.headers['x-user-id']) proxyReq.setHeader('x-user-id', req.headers['x-user-id'] as string);
      if (req.headers['x-user-email']) proxyReq.setHeader('x-user-email', req.headers['x-user-email'] as string);
    },
    onProxyRes: (proxyRes, req, res) => {
      applyRateHeaders(res);
    },
    onError: (err, req, res) => {
      console.error('Parser service error:', err.message);
      (res as any).status(503).json({
        success: false,
        message: 'Parser service unavailable',
      });
    },
  })
);

app.use(
  '/api/theme',
  createProxyMiddleware({
    target: THEME_SERVICE_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req: any, res) => {
      console.log(`[Theme] ${req.method} ${req.url}`);
      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
      if (req.headers['x-user-id']) proxyReq.setHeader('x-user-id', req.headers['x-user-id'] as string);
      if (req.headers['x-user-email']) proxyReq.setHeader('x-user-email', req.headers['x-user-email'] as string);
    },
    onProxyRes: (proxyRes, req, res) => {
      applyRateHeaders(res);
    },
    onError: (err, req, res) => {
      console.error('Theme service error:', err.message);
      (res as any).status(503).json({
        success: false,
        message: 'Theme service unavailable',
      });
    },
  })
);

app.use(
  '/api/export',
  createProxyMiddleware({
    target: EXPORT_SERVICE_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req: any, res) => {
      console.log(`[Export] ${req.method} ${req.url}`);
      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
      if (req.headers['x-user-id']) proxyReq.setHeader('x-user-id', req.headers['x-user-id'] as string);
      if (req.headers['x-user-email']) proxyReq.setHeader('x-user-email', req.headers['x-user-email'] as string);
    },
    onProxyRes: (proxyRes, req, res) => {
      applyRateHeaders(res);
    },
    onError: (err, req, res) => {
      console.error('Export service error:', err.message);
      (res as any).status(503).json({
        success: false,
        message: 'Export service unavailable',
      });
    },
  })
);

// 8. VIEWER SERVICE - Public documentation (high read volume)
app.use('/api/view', readLimiter); // High read limit for public docs

app.use(
  '/api/view',
  createProxyMiddleware({
    target: VIEWER_SERVICE_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req: any, res) => {
      console.log(`[Viewer] ${req.method} ${req.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      applyRateHeaders(res);
    },
    onError: (err, req, res) => {
      console.error('Viewer service error:', err.message);
      (res as any).status(503).json({
        success: false,
        message: 'Viewer service unavailable',
      });
    },
  })
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Gateway error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📡 Proxying to microservices:`);
  console.log(`  - Auth: ${AUTH_SERVICE_URL}`);
  console.log(`  - Projects: ${PROJECTS_SERVICE_URL}`);
  console.log(`  - Pages: ${PAGES_SERVICE_URL}`);
  console.log(`  - Parser: ${PARSER_SERVICE_URL}`);
  console.log(`  - Theme: ${THEME_SERVICE_URL}`);
  console.log(`  - Export: ${EXPORT_SERVICE_URL}`);
  console.log(`  - Viewer: ${VIEWER_SERVICE_URL} (Public Docs)`);
});

export default app;
