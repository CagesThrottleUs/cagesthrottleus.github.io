/**
 * Blog Service
 *
 * Fetches blog content from the GitHub blog branch via raw content API.
 * No authentication required (public repository).
 */

import { BLOG_BASE_URL } from "../utils/constants";

import type { BlogIndex, BlogMetadata, PageManifest } from "../types/blog";

/**
 * Fetch blog index manifest
 * Contains metadata about all posts, total count, and page links
 */
export async function fetchBlogIndex(): Promise<BlogIndex> {
  const response = await fetch(`${BLOG_BASE_URL}/manifests/index.json`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch blog index: ${response.statusText}`);
  }

  return (await response.json()) as BlogIndex;
}

/**
 * Fetch a specific page of blog posts
 */
export async function fetchPage(pageNum: number): Promise<PageManifest> {
  const response = await fetch(
    `${BLOG_BASE_URL}/manifests/page-${String(pageNum)}.json`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch page ${String(pageNum)}: ${response.statusText}`,
    );
  }

  return (await response.json()) as PageManifest;
}

/**
 * Fetch metadata for a specific post
 */
export async function fetchPostMetadata(
  slug: string,
): Promise<BlogMetadata | null> {
  try {
    // In dev, add timestamp to URL to bust cache (avoids CORS preflight issues)
    const isDev = import.meta.env.DEV;
    const url = isDev
      ? `${BLOG_BASE_URL}/manifests/metadata/${slug}.json?t=${Date.now().toString()}`
      : `${BLOG_BASE_URL}/manifests/metadata/${slug}.json`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as BlogMetadata;
  } catch (error) {
    console.error(`Error fetching metadata for ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch MDX content for a specific post
 */
export async function fetchPostContent(slug: string): Promise<string> {
  // In dev, add timestamp to URL to bust cache (avoids CORS preflight issues)
  const isDev = import.meta.env.DEV;
  const url = isDev
    ? `${BLOG_BASE_URL}/posts/${slug}.mdx?t=${Date.now().toString()}`
    : `${BLOG_BASE_URL}/posts/${slug}.mdx`;

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch post ${slug}: ${response.statusText}`);
  }

  return await response.text();
}
