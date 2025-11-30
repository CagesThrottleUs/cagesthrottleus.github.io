import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock navigator.languages and userLanguage
Object.defineProperty(navigator, "languages", {
  writable: true,
  value: ["en-US", "en"],
});

Object.defineProperty(navigator, "language", {
  writable: true,
  value: "en-US",
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];

  disconnect(): void {}
  observe(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  unobserve(): void {}
}

globalThis.IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Mock window.scrollTo (not implemented in jsdom)
window.scrollTo = () => {
  // No-op for tests
};

// Suppress console errors that are expected in test environment
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  const message = String(args[0]);

  // Suppress React error boundary warnings in tests (expected behavior)
  if (message.includes("An error occurred in the")) return;
  if (message.includes("Consider adding an error boundary")) return;
  if (message.includes("error-boundaries")) return;

  // Suppress DOM cleanup errors from mermaid
  if (message.includes("node to be removed is not a child")) return;

  // Suppress act() warnings (tests handle async properly with waitFor)
  if (message.includes("was not wrapped in act")) return;

  // Call original for actual errors
  originalConsoleError(...args);
};

// Suppress unhandled DOM errors during test cleanup
// These occur when mermaid tries to clean up nodes that React Testing Library already removed
window.addEventListener(
  "error",
  (event: ErrorEvent) => {
    const errorMessage =
      event.error instanceof Error
        ? event.error.message
        : typeof event.message === "string"
          ? event.message
          : "";
    if (errorMessage.includes("node to be removed is not a child")) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },
  true,
);

// Also handle unhandled promise rejections
window.addEventListener(
  "unhandledrejection",
  (event: PromiseRejectionEvent) => {
    const rejectionMessage =
      event.reason instanceof Error
        ? event.reason.message
        : typeof event.reason === "string"
          ? event.reason
          : "";
    if (rejectionMessage.includes("node to be removed is not a child")) {
      event.preventDefault();
    }
  },
);
