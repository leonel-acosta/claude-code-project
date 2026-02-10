import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock fetch globally
global.fetch = vi.fn();

// Create a mock geolocation object
export const mockGeolocation = {
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn(),
  clearWatch: vi.fn(),
};

// Override only geolocation on navigator (preserve other navigator properties)
Object.defineProperty(navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
  configurable: true,
});
