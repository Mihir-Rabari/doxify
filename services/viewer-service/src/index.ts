import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import viewerRoutes from './routes/viewer.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4007;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/doxify';

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'viewer-service',
    timestamp: new Date().toISOString()
  });
});

// Viewer routes
app.use('/api/view', viewerRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    message: 'The requested documentation does not exist or is not published.'
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Viewer service error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Database connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Viewer Service running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

export default app;
