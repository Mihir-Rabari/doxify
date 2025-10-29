module.exports = {
  apps: [
    // API Gateway (public-facing)
    {
      name: 'api-gateway',
      script: './services/api-gateway/dist/index.js',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        // Service URLs
        AUTH_SERVICE_URL: 'http://localhost:4001',
        PROJECTS_SERVICE_URL: 'http://localhost:4002',
        PAGES_SERVICE_URL: 'http://localhost:4003',
        PARSER_SERVICE_URL: 'http://localhost:4004',
        THEME_SERVICE_URL: 'http://localhost:4005',
        EXPORT_SERVICE_URL: 'http://localhost:4006',
        VIEWER_SERVICE_URL: 'http://localhost:4007',
        MCP_SERVICE_URL: 'http://localhost:4008',
        // Security (CHANGE THESE!)
        JWT_SECRET: 'CHANGE_ME_IN_PRODUCTION',
        ALLOWED_ORIGINS: 'https://doxify.onrender.com',
        CSRF_ENABLED: 'true',
      },
      error_file: './logs/api-gateway-error.log',
      out_file: './logs/api-gateway-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },

    // Auth Service
    {
      name: 'auth-service',
      script: './services/auth-service/dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
        PORT: 4001,
        MONGODB_URI: 'mongodb://localhost:27017/doxify',
        JWT_SECRET: 'CHANGE_ME_IN_PRODUCTION',
        JWT_EXPIRES_IN: '15m',
        REFRESH_JWT_SECRET: 'CHANGE_ME_IN_PRODUCTION',
        REFRESH_TOKEN_EXPIRES_IN: '30d',
        REFRESH_TOKEN_COOKIE: 'true',
        REFRESH_TOKEN_COOKIE_NAME: 'rt',
        ALLOWED_ORIGINS: 'https://doxify.onrender.com',
      },
      error_file: './logs/auth-service-error.log',
      out_file: './logs/auth-service-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },

    // Projects Service
    {
      name: 'projects-service',
      script: './services/projects-service/dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
        PORT: 4002,
        MONGODB_URI: 'mongodb://localhost:27017/doxify',
        ALLOWED_ORIGINS: 'https://doxify.onrender.com',
      },
      error_file: './logs/projects-service-error.log',
      out_file: './logs/projects-service-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },

    // Pages Service
    {
      name: 'pages-service',
      script: './services/pages-service/dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
        PORT: 4003,
        MONGODB_URI: 'mongodb://localhost:27017/doxify',
        PARSER_SERVICE_URL: 'http://localhost:4004',
        ALLOWED_ORIGINS: 'https://doxify.onrender.com',
      },
      error_file: './logs/pages-service-error.log',
      out_file: './logs/pages-service-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },

    // Parser Service
    {
      name: 'parser-service',
      script: './services/parser-service/dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 4004,
        ALLOWED_ORIGINS: 'https://doxify.onrender.com',
      },
      error_file: './logs/parser-service-error.log',
      out_file: './logs/parser-service-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },

    // Theme Service
    {
      name: 'theme-service',
      script: './services/theme-service/dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
        PORT: 4005,
        MONGODB_URI: 'mongodb://localhost:27017/doxify',
        ALLOWED_ORIGINS: 'https://doxify.onrender.com',
      },
      error_file: './logs/theme-service-error.log',
      out_file: './logs/theme-service-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },

    // Export Service
    {
      name: 'export-service',
      script: './services/export-service/dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 4006,
        MONGODB_URI: 'mongodb://localhost:27017/doxify',
        ALLOWED_ORIGINS: 'https://doxify.onrender.com',
      },
      error_file: './logs/export-service-error.log',
      out_file: './logs/export-service-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },

    // Viewer Service
    {
      name: 'viewer-service',
      script: './services/viewer-service/dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
        PORT: 4007,
        MONGODB_URI: 'mongodb://localhost:27017/doxify',
        ALLOWED_ORIGINS: 'https://doxify.onrender.com',
      },
      error_file: './logs/viewer-service-error.log',
      out_file: './logs/viewer-service-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },

    // MCP Service
    {
      name: 'mcp-service',
      script: './services/mcp-service/dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
        PORT: 4008,
        MONGODB_URI: 'mongodb://localhost:27017/doxify',
        ALLOWED_ORIGINS: 'https://doxify.onrender.com',
      },
      error_file: './logs/mcp-service-error.log',
      out_file: './logs/mcp-service-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
