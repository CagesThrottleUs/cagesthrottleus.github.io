import { describe, it, expect, beforeEach, vi } from "vitest";

import {
  fetchBlogIndex,
  fetchPage,
  fetchPostMetadata,
  fetchPostContent,
} from "../blogService";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      // Use object destructuring instead of delete for dynamic keys
      const { [key]: _, ...rest } = store;
      store = rest;
    },
    clear: () => {
      store = {};
    },
    key: (index: number) => Object.keys(store)[index] || null,
    get length() {
      return Object.keys(store).length;
    },
    // Add keys() method for Object.keys(localStorage)
    keys: () => Object.keys(store),
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  configurable: true,
  writable: true,
});

// Mock Object.keys to work with localStorage
const originalObjectKeys = Object.keys;
vi.spyOn(Object, "keys").mockImplementation((obj: unknown) => {
  if (obj === localStorageMock) {
    return localStorageMock.keys();
  }
  return originalObjectKeys(obj as object);
});

// Mock fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch as unknown as typeof fetch;

describe("blogService", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe("fetchBlogIndex", () => {
    it("should fetch blog index", async () => {
      const mockIndex = {
        version: "2025-11-29",
        totalPosts: 2,
        totalPages: 1,
        postsPerPage: 50,
        latestPosts: [],
        pages: {},
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockIndex),
      });

      const result = await fetchBlogIndex();

      expect(result).toEqual(mockIndex);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/manifests/index.json"),
        { cache: "no-store" },
      );
    });

    it("should throw error on failed fetch", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Not Found",
      });

      await expect(fetchBlogIndex()).rejects.toThrow(
        "Failed to fetch blog index",
      );
    });
  });

  describe("fetchPage", () => {
    it("should fetch page data", async () => {
      const mockPage = {
        page: 1,
        posts: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPage),
      });

      const result = await fetchPage(1);

      expect(result).toEqual(mockPage);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/manifests/page-1.json"),
        { cache: "no-store" },
      );
    });

    it("should throw error on failed page fetch", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Not Found",
      });

      await expect(fetchPage(1)).rejects.toThrow("Failed to fetch page 1");
    });
  });

  describe("fetchPostMetadata", () => {
    it("should fetch post metadata", async () => {
      const mockMetadata = {
        slug: "test-post",
        title: "Test Post",
        classification: "UNCLASSIFIED",
        abstract: "Test abstract",
        publishDate: "2025-11-29",
        version: "1.0",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMetadata),
      });

      const result = await fetchPostMetadata("test-post");

      expect(result).toEqual(mockMetadata);
    });

    it("should return null on 404", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      const result = await fetchPostMetadata("nonexistent");

      expect(result).toBeNull();
    });

    it("should return null on fetch error", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const result = await fetchPostMetadata("test-post");

      expect(result).toBeNull();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("fetchPostContent", () => {
    it("should fetch post content", async () => {
      const mockContent = "# Test Post\n\nContent here";

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockContent),
      });

      const result = await fetchPostContent("test-post");

      expect(result).toBe(mockContent);
    });

    it("should throw error on failed fetch", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Not Found",
      });

      await expect(fetchPostContent("nonexistent")).rejects.toThrow(
        "Failed to fetch post",
      );
    });
  });
});
