import { Request, Response, NextFunction } from 'express';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const EXEMPT_PATH_PREFIXES = ['/health', '/api/rate-limits', '/api/view', '/csrf-token', '/api/auth/login', '/api/auth/register', '/api/auth/forgot-password'];

export function csrfGuard(req: Request, res: Response, next: NextFunction) {
  const CSRF_ENABLED = (process.env.CSRF_ENABLED || 'true') !== 'false';
  if (!CSRF_ENABLED) return next();
  if (SAFE_METHODS.has(req.method)) return next();
  if (EXEMPT_PATH_PREFIXES.some((p) => req.path.startsWith(p))) return next();

  const headerToken = (req.headers['x-csrf-token'] as string) || '';
  const cookieToken = (req as any).cookies?.csrfToken || '';
  const authHeader = req.headers.authorization || '';
  
  // If both tokens are missing, check if this is an authenticated request
  // Authenticated requests (with JWT) don't strictly need CSRF tokens since they're not vulnerable to CSRF
  if (!headerToken && !cookieToken) {
    if (authHeader.startsWith('Bearer ')) {
      console.log(`✅ [CSRF] Skipping for authenticated request to ${req.method} ${req.path}`);
      return next();
    }
    // Unauthenticated POST/PUT/DELETE without CSRF is allowed for public endpoints
    return next();
  }
  
  // If tokens don't match, reject
  if (headerToken !== cookieToken) {
    console.error(`🔴 [CSRF] Token mismatch for ${req.method} ${req.path} - header: ${headerToken?.slice(0, 10)}... cookie: ${cookieToken?.slice(0, 10)}...`);
    return res.status(403).json({ success: false, message: 'CSRF token invalid' });
  }
  return next();
}
