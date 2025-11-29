import { describe, it, expect, beforeEach, vi } from "vitest";

import {
  fetchBlogIndex,
  fetchPage,
  fetchPostMetadata,
  fetchPostContent,
  clearBlogCache,
  getCacheStats,
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
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete store[key];
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
    it("should fetch and cache blog index", async () => {
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
        { cache: "no-cache" },
      );

      // Verify caching
      const cached = localStorageMock.getItem("blog-index-v1");
      expect(cached).toBeTruthy();
    });

    it("should return cached data if available", async () => {
      const mockIndex = {
        version: "2025-11-29",
        totalPosts: 2,
        totalPages: 1,
        postsPerPage: 50,
        latestPosts: [],
        pages: {},
      };

      // Set cache
      localStorageMock.setItem(
        "blog-index-v1",
        JSON.stringify({
          data: mockIndex,
          timestamp: Date.now(),
        }),
      );

      const result = await fetchBlogIndex();

      expect(result).toEqual(mockIndex);
      expect(mockFetch).not.toHaveBeenCalled();
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
    it("should fetch and cache page data", async () => {
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
        { cache: "no-cache" },
      );
    });

    it("should return cached page data", async () => {
      const mockPage = {
        page: 1,
        posts: [],
      };

      localStorageMock.setItem(
        "blog-page-1-v1",
        JSON.stringify({
          data: mockPage,
          timestamp: Date.now(),
        }),
      );

      const result = await fetchPage(1);

      expect(result).toEqual(mockPage);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("fetchPostMetadata", () => {
    it("should fetch and cache post metadata", async () => {
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
    it("should fetch and cache post content", async () => {
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

  describe("clearBlogCache", () => {
    it("should remove all blog-related cache entries", () => {
      localStorageMock.setItem("blog-index-v1", "test");
      localStorageMock.setItem("blog-page-1-v1", "test");
      localStorageMock.setItem("other-key", "test");

      clearBlogCache();

      expect(localStorageMock.getItem("blog-index-v1")).toBeNull();
      expect(localStorageMock.getItem("blog-page-1-v1")).toBeNull();
      expect(localStorageMock.getItem("other-key")).toBe("test");
    });
  });

  describe("getCacheStats", () => {
    it("should return cache statistics", () => {
      localStorageMock.setItem("blog-index-v1", "test1");
      localStorageMock.setItem("blog-page-1-v1", "test2");
      localStorageMock.setItem("other-key", "test3");

      const stats = getCacheStats();

      expect(stats.totalEntries).toBe(2);
      expect(stats.entries).toEqual(["blog-index-v1", "blog-page-1-v1"]);
      expect(stats.totalSize).toBeGreaterThan(0);
    });
  });

  describe("cache expiration", () => {
    it("should ignore expired cache entries", async () => {
      const mockIndex = {
        version: "2025-11-29",
        totalPosts: 2,
        totalPages: 1,
        postsPerPage: 50,
        latestPosts: [],
        pages: {},
      };

      // Set expired cache (6 minutes ago)
      const sixMinutesAgo = Date.now() - 6 * 60 * 1000;
      localStorageMock.setItem(
        "blog-index-v1",
        JSON.stringify({
          data: mockIndex,
          timestamp: sixMinutesAgo,
        }),
      );

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockIndex),
      });

      await fetchBlogIndex();

      // Should fetch fresh data
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("cache error handling", () => {
    it("should handle corrupted cache data gracefully", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Set corrupted cache
      localStorageMock.setItem("blog-index-v1", "invalid json{");

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
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("should handle localStorage write errors gracefully", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock setItem to throw error
      const originalSetItem = localStorageMock.setItem;
      localStorageMock.setItem = () => {
        throw new Error("QuotaExceededError");
      };

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

      // Should still return data even if caching fails
      expect(result).toEqual(mockIndex);
      expect(consoleErrorSpy).toHaveBeenCalled();

      // Restore
      localStorageMock.setItem = originalSetItem;
      consoleErrorSpy.mockRestore();
    });
  });
});
