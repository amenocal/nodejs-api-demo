// Global test setup
process.env.NODE_ENV = 'test';

// Mock console.log to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(), // Mock console.error to suppress error output in tests
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};
