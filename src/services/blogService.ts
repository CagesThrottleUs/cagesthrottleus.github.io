/**
 * Blog Service
 *
 * Fetches blog content from the GitHub blog branch via raw content API.
 * Implements localStorage caching with configurable TTL.
 * No authentication required (public repository).
 */

import type {
  BlogIndex,
  BlogMetadata,
  PageManifest,
  CacheEntry,
} from "../types/blog";

// Configuration
const REPO = "cagesthrottleus/cagesthrottleus.github.io";
const BLOG_BRANCH = "blog";
const BASE_URL = `https://raw.githubusercontent.com/${REPO}/${BLOG_BRANCH}`;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Get cached data from localStorage
 */
function getCached<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const entry: CacheEntry<T> = JSON.parse(cached);

    // Check if cache is expired
    if (Date.now() - entry.timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }

    return entry.data;
  } catch (error) {
    console.error(`Error reading cache for ${key}:`, error);
    return null;
  }
}

/**
 * Set data in localStorage cache
 */
function setCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    console.error(`Error setting cache for ${key}:`, error);
    // Don't throw - caching is optional
  }
}

/**
 * Fetch blog index manifest
 * Contains metadata about all posts, total count, and page links
 */
export async function fetchBlogIndex(): Promise<BlogIndex> {
  const cacheKey = "blog-index-v1";

  // Try cache first
  const cached = getCached<BlogIndex>(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from GitHub
  const response = await fetch(`${BASE_URL}/manifests/index.json`, {
    cache: "no-cache", // Bypass browser cache, use our localStorage
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch blog index: ${response.statusText}`);
  }

  const data: BlogIndex = await response.json();
  setCache(cacheKey, data);
  return data;
}

/**
 * Fetch a specific page of blog posts
 */
export async function fetchPage(pageNum: number): Promise<PageManifest> {
  const cacheKey = `blog-page-${pageNum}-v1`;

  // Try cache first
  const cached = getCached<PageManifest>(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from GitHub
  const response = await fetch(`${BASE_URL}/manifests/page-${pageNum}.json`, {
    cache: "no-cache",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch page ${pageNum}: ${response.statusText}`);
  }

  const data: PageManifest = await response.json();
  setCache(cacheKey, data);
  return data;
}

/**
 * Fetch metadata for a specific post
 */
export async function fetchPostMetadata(
  slug: string,
): Promise<BlogMetadata | null> {
  const cacheKey = `blog-metadata-${slug}-v1`;

  // Try cache first
  const cached = getCached<BlogMetadata>(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from GitHub
  try {
    const response = await fetch(
      `${BASE_URL}/manifests/metadata/${slug}.json`,
      {
        cache: "no-cache",
      },
    );

    if (!response.ok) {
      return null;
    }

    const data: BlogMetadata = await response.json();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching metadata for ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch MDX content for a specific post
 */
export async function fetchPostContent(slug: string): Promise<string> {
  const cacheKey = `blog-content-${slug}-v1`;

  // Try cache first
  const cached = getCached<string>(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from GitHub
  const response = await fetch(`${BASE_URL}/posts/${slug}.mdx`, {
    cache: "no-cache",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch post ${slug}: ${response.statusText}`);
  }

  const content = await response.text();
  setCache(cacheKey, content);
  return content;
}

/**
 * Clear all blog-related caches
 * Useful for forcing a refresh
 */
export function clearBlogCache(): void {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith("blog-")) {
      localStorage.removeItem(key);
    }
  });
}

/**
 * Get cache statistics for debugging
 */
export function getCacheStats(): {
  totalEntries: number;
  totalSize: number;
  entries: string[];
} {
  const keys = Object.keys(localStorage);
  const blogKeys = keys.filter((key) => key.startsWith("blog-"));

  let totalSize = 0;
  blogKeys.forEach((key) => {
    const item = localStorage.getItem(key);
    if (item) {
      totalSize += item.length;
    }
  });

  return {
    totalEntries: blogKeys.length,
    totalSize,
    entries: blogKeys,
  };
}

