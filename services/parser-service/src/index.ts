import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import parserRoutes from './routes/parser.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

dotenv.config();

// Configuration
interface Config {
  port: number;
  host: string;
  nodeEnv: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || '4004', 10),
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'production',
};

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'parser-service' });
});

app.use('/api/parser', parserRoutes);

// Error handler
app.use(errorHandler);

// Start server
const server = app.listen(config.port, config.host, () => {
  console.log(`🚀 Parser Service running on ${config.host}:${config.port}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
});

// Graceful shutdown
const shutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('✅ Parser Service shut down complete');
    process.exit(0);
  });
  
  setTimeout(() => {
    console.error('⚠️  Forced shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;
