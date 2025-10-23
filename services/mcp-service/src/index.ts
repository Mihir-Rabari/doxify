import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mcpRoutes from './routes/mcp.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4008;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'mcp-service',
    version: '1.0.0',
    protocol: 'Model Context Protocol',
    timestamp: new Date().toISOString()
  });
});

// MCP Routes
app.use('/mcp', mcpRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MCP Service running on port ${PORT}`);
  console.log(`📡 Model Context Protocol: http://localhost:${PORT}/mcp`);
  console.log(`🔍 Tools available: http://localhost:${PORT}/mcp/tools`);
});

export default app;
