import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per 15 minutes (supports frequent auto-save)
  message: 'Too many requests from this IP, please try again later.',
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api/', limiter);

// Service URLs
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:4001';
const PROJECTS_SERVICE_URL = process.env.PROJECTS_SERVICE_URL || 'http://localhost:4002';
const PAGES_SERVICE_URL = process.env.PAGES_SERVICE_URL || 'http://localhost:4003';
const PARSER_SERVICE_URL = process.env.PARSER_SERVICE_URL || 'http://localhost:4004';
const THEME_SERVICE_URL = process.env.THEME_SERVICE_URL || 'http://localhost:4005';
const EXPORT_SERVICE_URL = process.env.EXPORT_SERVICE_URL || 'http://localhost:4006';

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.json({
    name: 'Doxify API Gateway',
    version: '1.0.0',
    description: 'Central API gateway for Doxify microservices',
    services: {
      auth: '/api/auth',
      projects: '/api/projects',
      pages: '/api/pages',
      parser: '/api/parser',
      theme: '/api/theme',
      export: '/api/export',
    },
  });
});

// Service proxies
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
});

export default app;
