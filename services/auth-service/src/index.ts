import express from 'express';
import cors from 'cors';
import { Firestore } from '@google-cloud/firestore';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/error.middleware';
import { initUserRepository } from './models/user.model';

// Configuration
interface Config {
  port: number;
  host: string;
  gcpProjectId?: string;
  nodeEnv: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || '4001', 10),
  host: process.env.HOST || '0.0.0.0', // Cloud Run requirement
  gcpProjectId: process.env.GCP_PROJECT_ID,
  nodeEnv: process.env.NODE_ENV || 'production',
};

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

app.use('/api/auth', authRoutes);

// Error handler
app.use(errorHandler);

// Initialize Firestore
try {
  const db = new Firestore(config.gcpProjectId ? { projectId: config.gcpProjectId } : {});
  initUserRepository(db);
  console.log('✅ Connected to Firestore');
  console.log(`📊 GCP Project: ${config.gcpProjectId || 'Using default credentials'}`);
  
  // Start server (bind to 0.0.0.0 for Cloud Run)
  const server = app.listen(config.port, config.host, () => {
    console.log(`🚀 Auth Service running on ${config.host}:${config.port}`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
  });
  
  // Graceful shutdown for Cloud Run
  const shutdown = (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('✅ Auth Service shut down complete');
      process.exit(0);
    });
    
    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('⚠️  Forced shutdown');
      process.exit(1);
    }, 10000);
  };
  
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  
} catch (error) {
  console.error('❌ Firestore initialization error:', error);
  process.exit(1);
}

export default app;
