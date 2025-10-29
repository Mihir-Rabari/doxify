import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import exportRoutes from './routes/export.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4006;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/doxify';

// CORS allowlist
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
const corsOptions: cors.CorsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-User-Id', 'X-User-Email', 'X-CSRF-Token', 'Accept'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count', 'Content-Disposition'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  maxAge: 86400
};

// Middleware
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors(corsOptions));
app.use(hpp());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve exported files
app.use('/exports', express.static(path.join(__dirname, '../export')));

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'export-service' });
});

app.use('/api/export', exportRoutes);

// Error handler
app.use(errorHandler);

// Database connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Export Service running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

export default app;
