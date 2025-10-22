import rateLimit from 'express-rate-limit';

/**
 * Dynamic Rate Limiting Configuration
 * Different limits for different service endpoints based on their usage patterns
 */

// ============================================
// 1. SEARCH ENDPOINTS - High volume, read-only
// ============================================
export const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute (very high for search)
  message: {
    success: false,
    error: 'Too many search requests. Please wait a moment.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Count all requests
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Search rate limit exceeded. Please slow down.',
      retryAfter: 60,
      limit: 100,
      window: '1 minute'
    });
  }
});

// ============================================
// 2. PAGE EDITING - High frequency for auto-save
// ============================================
export const pageEditLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 updates per 15 minutes (auto-save every 2 seconds)
  message: {
    success: false,
    error: 'Too many page updates. Auto-save will resume shortly.',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Page update rate limit exceeded.',
      retryAfter: 900,
      limit: 500,
      window: '15 minutes'
    });
  }
});

// ============================================
// 3. AUTHENTICATION - Strict limits for security
// ============================================
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Only 10 auth attempts per 15 minutes
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again later.',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
  skipFailedRequests: false,
  handler: (req, res) => {
    console.warn(`🔒 [RATE LIMIT] Auth attempt blocked from IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many login attempts. Account temporarily locked.',
      retryAfter: 900,
      limit: 10,
      window: '15 minutes'
    });
  }
});

// ============================================
// 4. READ OPERATIONS - Moderate limits
// ============================================
export const readLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 200, // 200 requests per 5 minutes
  message: {
    success: false,
    error: 'Too many read requests. Please slow down.',
    retryAfter: 300
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Read rate limit exceeded.',
      retryAfter: 300,
      limit: 200,
      window: '5 minutes'
    });
  }
});

// ============================================
// 5. WRITE OPERATIONS - Lower limits
// ============================================
export const writeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // 50 write operations per 10 minutes
  message: {
    success: false,
    error: 'Too many write operations. Please slow down.',
    retryAfter: 600
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Write rate limit exceeded.',
      retryAfter: 600,
      limit: 50,
      window: '10 minutes'
    });
  }
});

// ============================================
// 6. EXPORT OPERATIONS - Very strict (resource intensive)
// ============================================
export const exportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Only 10 exports per hour
  message: {
    success: false,
    error: 'Export limit reached. Please try again later.',
    retryAfter: 3600
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Export rate limit exceeded. Exports are resource-intensive.',
      retryAfter: 3600,
      limit: 10,
      window: '1 hour'
    });
  }
});

// ============================================
// 7. PARSER OPERATIONS - Moderate (CPU intensive)
// ============================================
export const parserLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 30, // 30 parse operations per 10 minutes
  message: {
    success: false,
    error: 'Parser limit reached. Please try again later.',
    retryAfter: 600
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Parser rate limit exceeded.',
      retryAfter: 600,
      limit: 30,
      window: '10 minutes'
    });
  }
});

// ============================================
// 8. STANDARD OPERATIONS - Default fallback
// ============================================
export const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // 150 requests per 15 minutes
  message: {
    success: false,
    error: 'Too many requests. Please try again later.',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Rate limit exceeded.',
      retryAfter: 900,
      limit: 150,
      window: '15 minutes'
    });
  }
});

// ============================================
// 9. THEME OPERATIONS - Low limits (infrequent)
// ============================================
export const themeLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 20, // 20 theme operations per 30 minutes
  message: {
    success: false,
    error: 'Theme operation limit reached.',
    retryAfter: 1800
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Theme rate limit exceeded.',
      retryAfter: 1800,
      limit: 20,
      window: '30 minutes'
    });
  }
});

/**
 * Rate Limit Summary:
 * 
 * ENDPOINT TYPE          | WINDOW   | LIMIT | REASON
 * -----------------------|----------|-------|------------------
 * Search                 | 1 min    | 100   | High read volume
 * Page Editing (PUT)     | 15 min   | 500   | Auto-save every 2s
 * Authentication         | 15 min   | 10    | Security (brute force)
 * Read Operations (GET)  | 5 min    | 200   | Standard reads
 * Write Operations       | 10 min   | 50    | Creates/Deletes
 * Export                 | 1 hour   | 10    | Resource intensive
 * Parser                 | 10 min   | 30    | CPU intensive
 * Theme                  | 30 min   | 20    | Infrequent
 * Standard (Fallback)    | 15 min   | 150   | Default
 */
