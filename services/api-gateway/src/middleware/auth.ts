import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const PUBLIC_PATH_PREFIXES = ['/health', '/api/rate-limits', '/api/auth', '/api/view'];

export function authGuard(req: Request, res: Response, next: NextFunction) {
  // Allow public routes
  if (PUBLIC_PATH_PREFIXES.some((p) => req.path.startsWith(p))) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.substring('Bearer '.length);
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ success: false, message: 'Gateway not configured with JWT_SECRET' });
  }

  try {
    const payload = jwt.verify(token, secret) as any;
    // Forward identity to downstream services via headers
    req.headers['x-user-id'] = payload?.id || payload?._id || payload?.sub || '';
    req.headers['x-user-email'] = payload?.email || '';
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}