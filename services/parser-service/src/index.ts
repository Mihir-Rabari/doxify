import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import dotenv from 'dotenv';
import parserRoutes from './routes/parser.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4004;

// CORS allowlist - default to doxify frontend
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://doxify.onrender.com,https://doxify-prod-1.vercel.app,https://34.14.158.113.nip.io').split(',').map((s) => s.trim()).filter(Boolean);
console.log('🔐 [CORS] Allowed origins:', ALLOWED_ORIGINS);
const corsOptions: cors.CorsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.includes('*')) {
      console.log(`✅ [CORS] Allowing origin: ${origin}`);
      return cb(null, true);
    }
    console.error(`❌ [CORS] Rejected origin: ${origin}`);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  allowedHeaders: ['content-type', 'authorization', 'x-requested-with', 'x-user-id', 'x-user-email', 'x-csrf-token', 'accept'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  maxAge: 86400
};

// Middleware
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors(corsOptions));
app.use(hpp());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'parser-service' });
});

app.use('/api/parser', parserRoutes);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Parser Service running on port ${PORT}`);
});

export default app;
