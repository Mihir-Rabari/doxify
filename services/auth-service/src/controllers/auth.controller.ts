import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import ms from 'ms';

const JWT_SECRET = process.env.JWT_SECRET || 'doxify-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET || JWT_SECRET;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';

function resolveDuration(value: string, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const result = ms(value as ms.StringValue);
  if (typeof result === 'number') {
    return result;
  }
  console.warn(`Invalid duration "${value}" passed to ms(); using fallback ${fallback}ms`);
  return fallback;
}
const REFRESH_TOKEN_COOKIE = (process.env.REFRESH_TOKEN_COOKIE || 'true') === 'true';
const REFRESH_COOKIE_NAME = process.env.REFRESH_TOKEN_COOKIE_NAME || 'rt';

function setRefreshCookie(res: Response, token: string) {
  const isProd = (process.env.NODE_ENV || 'development') === 'production';
  const maxAge = resolveDuration(REFRESH_TOKEN_EXPIRES_IN, 30 * 24 * 60 * 60 * 1000);
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'lax' : 'lax',
    maxAge,
    path: '/',
  });
}

export const register = async (req: Request, res: Response) => {
  console.log('🔵 [AUTH] Register request received');
  console.log('🔵 [AUTH] Request body:', JSON.stringify(req.body));
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ [AUTH] Validation errors:', errors.array());
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password, name } = req.body;
    console.log('🔵 [AUTH] Parsed data:', { email, name, passwordLength: password?.length });

    // Validate input
    if (!email || !password || !name) {
      console.log('❌ [AUTH] Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required',
      });
    }

    // Check if user already exists
    console.log('🔵 [AUTH] Checking if user exists:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ [AUTH] User already exists:', email);
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Hash password
    console.log('🔵 [AUTH] Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('✅ [AUTH] Password hashed successfully');

    // Create user
    console.log('🔵 [AUTH] Creating user in database...');
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });
    console.log('✅ [AUTH] User created successfully:', user._id);

    // Generate access + refresh tokens
    console.log('🔵 [AUTH] Generating JWT tokens...');
    const token = jwt.sign(
      { userId: String(user._id), email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as any
    );
    const jti = new Date().getTime().toString(36) + Math.random().toString(36).slice(2);
    const refreshTtl = resolveDuration(REFRESH_TOKEN_EXPIRES_IN, 30 * 24 * 60 * 60 * 1000);
    (user as any).refreshTokenId = jti;
    (user as any).refreshTokenExpiresAt = new Date(Date.now() + refreshTtl);
    await user.save();
    const refreshToken = jwt.sign(
      { userId: String(user._id), jti },
      REFRESH_JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN } as any
    );
    console.log('✅ [AUTH] JWT tokens generated successfully');

    if (REFRESH_TOKEN_COOKIE) {
      setRefreshCookie(res, refreshToken);
    }

    const response = {
      success: true,
      data: {
        token,
        refreshToken: REFRESH_TOKEN_COOKIE ? undefined : refreshToken,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    };
    
    console.log('✅ [AUTH] Sending success response');
    res.status(201).json(response);
  } catch (error: any) {
    console.error('❌ [AUTH] Registration error:', error);
    console.error('❌ [AUTH] Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate access + refresh tokens
    const token = jwt.sign(
      { userId: String(user._id), email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as any
    );
    const jti = new Date().getTime().toString(36) + Math.random().toString(36).slice(2);
    const refreshTtl = resolveDuration(REFRESH_TOKEN_EXPIRES_IN, 30 * 24 * 60 * 60 * 1000);
    (user as any).refreshTokenId = jti;
    (user as any).refreshTokenExpiresAt = new Date(Date.now() + refreshTtl);
    await user.save();
    const refreshToken = jwt.sign(
      { userId: String(user._id), jti },
      REFRESH_JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN } as any
    );

    if (REFRESH_TOKEN_COOKIE) {
      setRefreshCookie(res, refreshToken);
    }

    res.json({
      success: true,
      data: {
        token,
        refreshToken: REFRESH_TOKEN_COOKIE ? undefined : refreshToken,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message,
    });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    let { refreshToken } = req.body || {};
    if (!refreshToken && (req as any).cookies && (req as any).cookies[REFRESH_COOKIE_NAME]) {
      refreshToken = (req as any).cookies[REFRESH_COOKIE_NAME];
    }
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'refreshToken is required' });
    }

    const decoded = jwt.verify(refreshToken, REFRESH_JWT_SECRET) as any;
    const userId = decoded.userId as string;
    const jti = decoded.jti as string;

    const user = await User.findById(userId);
    if (!user || (user as any).refreshTokenId !== jti) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }
    if ((user as any).refreshTokenExpiresAt && (user as any).refreshTokenExpiresAt.getTime() < Date.now()) {
      return res.status(401).json({ success: false, message: 'Refresh token expired' });
    }

    // Rotate refresh token
    const newJti = new Date().getTime().toString(36) + Math.random().toString(36).slice(2);
    const refreshTtl = resolveDuration(REFRESH_TOKEN_EXPIRES_IN, 30 * 24 * 60 * 60 * 1000);
    ;(user as any).refreshTokenId = newJti;
    ;(user as any).refreshTokenExpiresAt = new Date(Date.now() + refreshTtl);
    await user.save();

    const newAccessToken = jwt.sign(
      { userId: String(user._id), email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as any
    );
    const newRefreshToken = jwt.sign(
      { userId: String(user._id), jti: newJti },
      REFRESH_JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN } as any
    );

    if (REFRESH_TOKEN_COOKIE) {
      setRefreshCookie(res, newRefreshToken);
    }

    return res.json({ success: true, data: { token: newAccessToken, refreshToken: REFRESH_TOKEN_COOKIE ? undefined : newRefreshToken } });
  } catch (error: any) {
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token', error: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    let { refreshToken } = req.body || {};
    if (!refreshToken && (req as any).cookies && (req as any).cookies[REFRESH_COOKIE_NAME]) {
      refreshToken = (req as any).cookies[REFRESH_COOKIE_NAME];
    }
    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, REFRESH_JWT_SECRET) as any;
        const user = await User.findById(decoded.userId);
        if (user) {
          ;(user as any).refreshTokenId = null;
          ;(user as any).refreshTokenExpiresAt = null;
          await user.save();
        }
      } catch (e) {
        // ignore
      }
    }
    if (REFRESH_TOKEN_COOKIE) {
      res.clearCookie(REFRESH_COOKIE_NAME, { path: '/' });
    }
    return res.json({ success: true, message: 'Logged out' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Logout failed', error: error.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message,
    });
  }
};
