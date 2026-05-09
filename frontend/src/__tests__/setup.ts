// Vitest setup file for frontend tests
// Global test utilities and mocks

import { config } from '@vue/test-utils';

// Mock Element Plus globally if needed
config.global.mocks = {
  $message: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
};