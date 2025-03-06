/**
 * Jest Setup File
 * 
 * This file configures the test environment for running Jest tests
 * with the Swiper initialization script.
 */

// Set up global mocks
global.MutationObserver = class {
  constructor(callback) {}
  disconnect() {}
  observe(element, initObject) {}
};

// Mock timer functions
jest.useFakeTimers();

// Set initial window properties
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  value: 1024
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Create a basic console.error mock to keep test output clean
const originalConsoleError = console.error;
console.error = jest.fn((...args) => {
  // Filter out expected errors for cleaner test output
  if (args[0] && typeof args[0] === 'string' && args[0].includes('Invalid JSON')) {
    return;
  }
  originalConsoleError(...args);
});

// Create a babel.config.js file for proper transpilation
console.log('Jest environment setup complete');
