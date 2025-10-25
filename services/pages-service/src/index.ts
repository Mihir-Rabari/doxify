import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Firestore } from '@google-cloud/firestore';
import pageRoutes from './routes/page.routes';
import sectionRoutes from './routes/section.routes';
import searchRoutes from './routes/search.routes';
import { errorHandler } from './middleware/error.middleware';
import { initPageRepository } from './repositories/page.repository';
import { initSectionRepository } from './repositories/section.repository';

dotenv.config();

// Configuration
interface Config {
  port: number;
  host: string;
  gcpProjectId?: string;
  nodeEnv: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || '4003', 10),
  host: process.env.HOST || '0.0.0.0',
  gcpProjectId: process.env.GCP_PROJECT_ID,
  nodeEnv: process.env.NODE_ENV || 'production',
};

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'pages-service' });
});

app.use('/api/pages', pageRoutes);
app.use('/api/pages', sectionRoutes);
app.use('/api/pages', searchRoutes);

// Error handler
app.use(errorHandler);

// Initialize Firestore
try {
  const db = new Firestore(config.gcpProjectId ? { projectId: config.gcpProjectId } : {});
  initPageRepository(db);
  initSectionRepository(db);
  console.log('✅ Connected to Firestore');
  console.log(`📊 GCP Project: ${config.gcpProjectId || 'Using default credentials'}`);
  
  // Start server
  const server = app.listen(config.port, config.host, () => {
    console.log(`🚀 Pages Service running on ${config.host}:${config.port}`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
  });
  
  // Graceful shutdown
  const shutdown = (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('✅ Pages Service shut down complete');
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
