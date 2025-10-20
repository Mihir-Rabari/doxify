import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import parserRoutes from './routes/parser.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4004;

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

app.listen(PORT, () => {
  console.log(`🚀 Parser Service running on port ${PORT}`);
});

export default app;
