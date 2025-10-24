import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserRepository } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'doxify-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

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
    const userRepo = getUserRepository();
    const existingUser = await userRepo.findOne({ email });
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
    const user = await userRepo.create({
      email,
      password: hashedPassword,
      name,
    });
    console.log('✅ [AUTH] User created successfully:', user.id);

    // Generate token
    console.log('🔵 [AUTH] Generating JWT token...');
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as any
    );
    console.log('✅ [AUTH] JWT token generated successfully');

    const response = {
      success: true,
      data: {
        token,
        user: {
          id: user.id,
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
    const userRepo = getUserRepository();
    const user = await userRepo.findOne({ email });
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

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as any
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
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

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const userRepo = getUserRepository();
    const user = await userRepo.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    res.json({
      success: true,
      data: userWithoutPassword,
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
