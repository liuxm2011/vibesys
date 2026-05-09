// Vitest setup file for backend API tests
// Database cleanup and test utilities

import { PrismaClient } from '@prisma/client';
import { beforeAll, afterAll, afterEach } from 'vitest';

const prisma = new PrismaClient();

// Clean database before tests
beforeAll(async () => {
  // Connection established
});

// Clean database after each test
afterEach(async () => {
  // Optional: truncate tables for isolation
});

// Disconnect after all tests
afterAll(async () => {
  await prisma.$disconnect();
});