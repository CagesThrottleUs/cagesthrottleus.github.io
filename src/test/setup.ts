import '@testing-library/jest-dom';

import { vi } from 'vitest';

// IntersectionObserver — S2 CardView's load-more sentinel requires it; jsdom omits it.
// Must be a class (constructable) — arrow-function vi.fn() is not new-able.
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: class MockIntersectionObserver {
    disconnect = vi.fn();
    observe = vi.fn();
    takeRecords = vi.fn();
    unobserve = vi.fn();
  },
});

// Baseline matchMedia mock — jsdom doesn't implement it.
// S2 components (and some older libs) call both the modern addEventListener API
// and the deprecated addListener API. Both must be present to avoid runtime errors.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
