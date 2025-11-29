/**
 * Blog system type definitions
 */

export interface BlogMetadata {
  slug: string;
  title: string;
  classification: string;
  abstract: string;
  publishDate: string; // YYYY-MM-DD format
  version: string;
  thumbnail?: string;
}

export interface BlogIndex {
  version: string; // ISO 8601 timestamp
  totalPosts: number;
  totalPages: number;
  postsPerPage: number;
  latestPosts: BlogMetadata[]; // Preview of latest 10 posts
  pages: Record<string, string>; // Page number to manifest URL mapping
}

export interface PageManifest {
  page: number;
  posts: BlogMetadata[];
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

