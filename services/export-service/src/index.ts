import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import exportRoutes from './routes/export.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4006;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/doxify';

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
