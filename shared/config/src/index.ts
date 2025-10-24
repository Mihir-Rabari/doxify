import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Common configuration interface for all services
 */
export interface ServiceConfig {
  // Server Configuration
  port: number;
  host: string;
  nodeEnv: string;
  
  // GCP Configuration
  gcpProjectId?: string;
  gcpRegion: string;
  
  // Security
  jwtSecret: string;
  jwtExpiresIn: string;
  
  // Service URLs (for inter-service communication)
  services: {
    auth: string;
    projects: string;
    pages: string;
    parser: string;
    theme: string;
    export: string;
    viewer: string;
    mcp: string;
  };
  
  // Frontend
  frontendUrl: string;
  publicUrl: string;
}

/**
 * Get environment variable with fallback
 */
const getEnv = (key: string, defaultValue: string = ''): string => {
  return process.env[key] || defaultValue;
};

/**
 * Get port from environment (Cloud Run uses PORT env variable)
 */
const getPort = (defaultPort: number): number => {
  const port = process.env.PORT || process.env.SERVICE_PORT;
  return port ? parseInt(port, 10) : defaultPort;
};

/**
 * Cloud Run best practice: bind to 0.0.0.0, not localhost
 */
const getHost = (): string => {
  return process.env.HOST || '0.0.0.0';
};

/**
 * Create service configuration
 * @param serviceName - Name of the service
 * @param defaultPort - Default port if PORT env is not set
 */
export const createConfig = (serviceName: string, defaultPort: number): ServiceConfig => {
  return {
    // Server
    port: getPort(defaultPort),
    host: getHost(),
    nodeEnv: getEnv('NODE_ENV', 'production'),
    
    // GCP
    gcpProjectId: process.env.GCP_PROJECT_ID,
    gcpRegion: getEnv('GCP_REGION', 'us-central1'),
    
    // Security
    jwtSecret: getEnv('JWT_SECRET', 'change-this-in-production'),
    jwtExpiresIn: getEnv('JWT_EXPIRES_IN', '7d'),
    
    // Service URLs (use Cloud Run URLs in production)
    services: {
      auth: getEnv('AUTH_SERVICE_URL', 'http://localhost:4001'),
      projects: getEnv('PROJECTS_SERVICE_URL', 'http://localhost:4002'),
      pages: getEnv('PAGES_SERVICE_URL', 'http://localhost:4003'),
      parser: getEnv('PARSER_SERVICE_URL', 'http://localhost:4004'),
      theme: getEnv('THEME_SERVICE_URL', 'http://localhost:4005'),
      export: getEnv('EXPORT_SERVICE_URL', 'http://localhost:4006'),
      viewer: getEnv('VIEWER_SERVICE_URL', 'http://localhost:4007'),
      mcp: getEnv('MCP_SERVICE_URL', 'http://localhost:4008'),
    },
    
    // Frontend
    frontendUrl: getEnv('FRONTEND_URL', 'http://localhost:3000'),
    publicUrl: getEnv('PUBLIC_URL', 'http://localhost:3000'),
  };
};

/**
 * Graceful shutdown handler for Cloud Run
 */
export const setupGracefulShutdown = (server: any, serviceName: string) => {
  const shutdown = (signal: string) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    
    server.close(() => {
      console.log(`✅ ${serviceName} shut down gracefully`);
      process.exit(0);
    });
    
    // Force shutdown after 10 seconds (Cloud Run timeout is 10s)
    setTimeout(() => {
      console.error('⚠️  Forced shutdown after 10s timeout');
      process.exit(1);
    }, 10000);
  };
  
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

/**
 * Validate required environment variables
 */
export const validateConfig = (config: ServiceConfig, required: string[] = []) => {
  const missing: string[] = [];
  
  if (required.includes('JWT_SECRET') && config.jwtSecret === 'change-this-in-production') {
    console.warn('⚠️  WARNING: Using default JWT_SECRET. Set JWT_SECRET environment variable!');
  }
  
  if (required.includes('GCP_PROJECT_ID') && !config.gcpProjectId) {
    missing.push('GCP_PROJECT_ID');
  }
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

/**
 * Log service configuration (without sensitive data)
 */
export const logConfig = (config: ServiceConfig, serviceName: string) => {
  console.log(`\n🔧 ${serviceName} Configuration:`);
  console.log(`  Port: ${config.port}`);
  console.log(`  Host: ${config.host}`);
  console.log(`  Environment: ${config.nodeEnv}`);
  console.log(`  GCP Project: ${config.gcpProjectId || 'Not set (using default credentials)'}`);
  console.log(`  GCP Region: ${config.gcpRegion}`);
  console.log(`  JWT Expires In: ${config.jwtExpiresIn}`);
  console.log('');
};
