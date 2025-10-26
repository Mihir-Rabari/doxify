import dotenv from 'dotenv';

dotenv.config();

const required = (key: string, fallback?: string) => {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable ${key}`);
  }
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? '4001'),
  mongodbUri: required('MONGODB_URI', 'mongodb://localhost:27017/doxify'),
  jwtSecret: required('JWT_SECRET', 'doxify-secret-key'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
};

export type AuthEnv = typeof env;
