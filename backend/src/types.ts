import type { PrismaClient } from '@prisma/client';

export type JwtPayload = {
  userId: number;
  studentId: string;
  name: string;
  role: 'STUDENT' | 'ADMIN';
};

export type AppEnv = {
  Bindings: {
    DB: D1Database;
    JWT_SECRET: string;
    FRONTEND_URL?: string;
    MINIMAX_API_KEY?: string;
    MINIMAX_BASE_URL?: string;
    MINIMAX_MODEL?: string;
    NODE_ENV?: string;
  };
  Variables: {
    user: JwtPayload;
    prisma: PrismaClient;
  };
};
