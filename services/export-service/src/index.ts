import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Firestore } from '@google-cloud/firestore';
import path from 'path';
import exportRoutes from './routes/export.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

// Configuration
interface Config {
  port: number;
  host: string;
  gcpProjectId?: string;
  nodeEnv: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || '4006', 10),
  host: process.env.HOST || '0.0.0.0',
  gcpProjectId: process.env.GCP_PROJECT_ID,
  nodeEnv: process.env.NODE_ENV || 'production',
};

const app = express();

// Middleware
app.use(cors());
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

// Initialize Firestore
try {
  const db = new Firestore(config.gcpProjectId ? { projectId: config.gcpProjectId } : {});
  console.log('✅ Connected to Firestore');
  console.log(`📊 GCP Project: ${config.gcpProjectId || 'Using default credentials'}`);
  
  // Start server
  const server = app.listen(config.port, config.host, () => {
    console.log(`🚀 Export Service running on ${config.host}:${config.port}`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
  });
  
  // Graceful shutdown
  const shutdown = (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('✅ Export Service shut down complete');
      process.exit(0);
    });
    
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
