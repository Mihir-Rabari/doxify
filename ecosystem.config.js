module.exports = {
  apps: [
    // Auth Service
    {
      name: 'auth-service',
      cwd: './services/auth-service',
      script: './node_modules/ts-node/dist/bin.js',
      args: '--transpileOnly src/index.ts',
      interpreter: 'node',
      env: {
        PORT: 4001,
        MONGODB_URI: 'mongodb://localhost:27017/doxify',
        JWT_SECRET: 'doxify-secret-key-change-in-production',
        JWT_EXPIRES_IN: '7d',
      },
      watch: false,
      autorestart: true,
      max_memory_restart: '300M',
    },

    // Projects Service
    {
      name: 'projects-service',
      cwd: './services/projects-service',
      script: './node_modules/ts-node/dist/bin.js',
      args: '--transpileOnly src/index.ts',
      interpreter: 'node',
      env: {
        PORT: 4002,
        MONGODB_URI: 'mongodb://localhost:27017/doxify',
      },
      watch: false,
      autorestart: true,
      max_memory_restart: '300M',
    },

    // Pages Service
    {
      name: 'pages-service',
      cwd: './services/pages-service',
      script: './node_modules/ts-node/dist/bin.js',
      args: '--transpileOnly src/index.ts',
      interpreter: 'node',
      env: {
        PORT: 4003,
        MONGODB_URI: 'mongodb://localhost:27017/doxify',
        PARSER_SERVICE_URL: 'http://localhost:4004',
      },
      watch: false,
      autorestart: true,
      max_memory_restart: '300M',
    },

    // Parser Service
    {
      name: 'parser-service',
      cwd: './services/parser-service',
      script: './node_modules/ts-node/dist/bin.js',
      args: '--transpileOnly src/index.ts',
      interpreter: 'node',
      env: {
        PORT: 4004,
      },
      watch: false,
      autorestart: true,
      max_memory_restart: '300M',
    },

    // Theme Service
    {
      name: 'theme-service',
      cwd: './services/theme-service',
      script: './node_modules/ts-node/dist/bin.js',
      args: '--transpileOnly src/index.ts',
      interpreter: 'node',
      env: {
        PORT: 4005,
        MONGODB_URI: 'mongodb://localhost:27017/doxify',
      },
      watch: false,
      autorestart: true,
      max_memory_restart: '300M',
    },

    // Export Service
    {
      name: 'export-service',
      cwd: './services/export-service',
      script: './node_modules/ts-node/dist/bin.js',
      args: '--transpileOnly src/index.ts',
      interpreter: 'node',
      env: {
        PORT: 4006,
        MONGODB_URI: 'mongodb://localhost:27017/doxify',
      },
      watch: false,
      autorestart: true,
      max_memory_restart: '300M',
    },

    // Viewer Service (Public Documentation)
    {
      name: 'viewer-service',
      cwd: './services/viewer-service',
      script: './node_modules/ts-node/dist/bin.js',
      args: '--transpileOnly src/index.ts',
      interpreter: 'node',
      env: {
        PORT: 4007,
        MONGODB_URI: 'mongodb://localhost:27017/doxify',
      },
      watch: false,
      autorestart: true,
      max_memory_restart: '300M',
    },

    // API Gateway
    {
      name: 'api-gateway',
      cwd: './services/api-gateway',
      script: './node_modules/ts-node/dist/bin.js',
      args: '--transpileOnly src/index.ts',
      interpreter: 'node',
      env: {
        PORT: 4000,
        AUTH_SERVICE_URL: 'http://localhost:4001',
        PROJECTS_SERVICE_URL: 'http://localhost:4002',
        PAGES_SERVICE_URL: 'http://localhost:4003',
        PARSER_SERVICE_URL: 'http://localhost:4004',
        THEME_SERVICE_URL: 'http://localhost:4005',
        EXPORT_SERVICE_URL: 'http://localhost:4006',
        VIEWER_SERVICE_URL: 'http://localhost:4007',
      },
      watch: false,
      autorestart: true,
      max_memory_restart: '300M',
    },

    // Frontend
    {
      name: 'frontend',
      cwd: './apps/web',
      script: './node_modules/vite/bin/vite.js',
      args: '',
      interpreter: 'node',
      env: {
        PORT: 5173,
      },
      watch: false,
      autorestart: true,
      max_memory_restart: '500M',
    },
  ],
};
