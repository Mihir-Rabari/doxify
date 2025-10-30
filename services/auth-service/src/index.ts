import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/error.middleware';
import { env } from './utils/env';

const app = express();
const PORT = env.port;
const MONGODB_URI = env.mongodbUri;

// CORS allowlist
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
console.log('🔐 [CORS] Allowed origins:', ALLOWED_ORIGINS);
const corsOptions: cors.CorsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin)) {
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
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

app.use('/api/auth', authRoutes);

// Error handler
app.use(errorHandler);

// Database connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Auth Service running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

export default app;
