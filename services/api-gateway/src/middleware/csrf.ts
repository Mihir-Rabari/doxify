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
  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    return res.status(403).json({ success: false, message: 'CSRF token missing or invalid' });
  }
  return next();
}