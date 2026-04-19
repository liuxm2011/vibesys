import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import topicsRoutes from './routes/topics.routes.js';
import aiRoutes from './routes/ai.routes.js';
import documentsRoutes from './routes/documents.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { generalLimiter } from './middleware/rate-limit.middleware.js';

dotenv.config();

// Validate required environment variables
function validateEnvironment(): void {
  const required = ['JWT_SECRET', 'DATABASE_URL'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error(`FATAL: Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  // Warn about optional but recommended variables
  if (!process.env.MINIMAX_API_KEY) {
    console.warn('WARNING: MINIMAX_API_KEY not configured, AI features will not work');
  }
}

validateEnvironment();

export const prisma = new PrismaClient();
export const app = express();

// Middleware setup
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true  // Required for httpOnly cookies (D-12)
}));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Apply general rate limiter to all routes
app.use(generalLimiter);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes (AUTH-01, AUTH-02, AUTH-03)
app.use('/api/auth', authRoutes);

// Topic routes (TOPIC-01, TOPIC-02, TOPIC-03, TOPIC-05)
app.use('/api/topics', topicsRoutes);

// Project routes (TOPIC-04, DASH-01, DASH-02)
app.use('/api/projects', projectsRoutes);

// AI routes (DOC-04: Document generation)
app.use('/api/ai', aiRoutes);

// Document routes (DOC-01~03, DOC-05: Document CRUD)
app.use('/api/documents', documentsRoutes);

// Admin routes (Phase 5: ADM-01~07)
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器错误' });
});

const PORT = process.env.PORT || 3000;

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});