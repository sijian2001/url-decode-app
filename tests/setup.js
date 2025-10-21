// Vitest setup file
import { beforeEach, afterEach } from 'vitest';

// Clean up DOM between tests
beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

// Mock clipboard API for testing
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue('test content'),
  },
});

// Add global test utilities
global.createMockElement = (tag, attributes = {}) => {
  const element = document.createElement(tag);
  Object.assign(element, attributes);
  return element;
};