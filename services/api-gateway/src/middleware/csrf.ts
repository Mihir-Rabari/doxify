import { Request, Response, NextFunction } from 'express';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const EXEMPT_PATH_PREFIXES = ['/health', '/api/rate-limits', '/api/view', '/csrf-token', '/api/auth/login', '/api/auth/register', '/api/auth/forgot-password'];

export function csrfGuard(req: Request, res: Response, next: NextFunction) {
  // CSRF protection disabled - JWT authentication is immune to CSRF attacks
  // All protected endpoints require a valid Bearer token in Authorization header
  return next();
}
