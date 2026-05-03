import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

export const env = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  apiUrl: process.env.API_URL || 'http://localhost:5000',
  
  // Database
  databaseUrl:
    process.env.DATABASE_URL || 'postgresql://postgres:Mihir1234@localhost:5432/eventify_db',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  jwtAccessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
  jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  
  // SMTP / Email
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || 'videostudio71@gmail.com',
    pass: process.env.SMTP_PASS || 'tgmy ainl qdwa lnsk',
    from: process.env.SMTP_FROM || process.env.SMTP_USER || 'videostudio71@gmail.com',
  },
  
  // Payment Gateway (Razorpay)
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_key',
    keySecret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  },
  
  // File Upload
  upload: {
    maxFileSize: Number(process.env.UPLOAD_MAX_SIZE || 5 * 1024 * 1024), // 5MB
    allowedTypes: (process.env.UPLOAD_ALLOWED_TYPES || 'image/jpeg,image/png,image/webp').split(','),
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000), // 15 minutes
    maxRequests: Number(process.env.RATE_LIMIT_MAX || 100),
  },
};
