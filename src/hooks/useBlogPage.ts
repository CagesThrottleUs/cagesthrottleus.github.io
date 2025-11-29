import { useState, useEffect } from "react";

import { fetchPage } from "../services/blogService";

import type { PageManifest } from "../types/blog";

/**
 * Custom hook to fetch a specific page of blog posts
 * Refetches when page number changes
 */
export function useBlogPage(pageNumber: number, enabled: boolean = true) {
  const [pageData, setPageData] = useState<PageManifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const loadPage = async () => {
      if (!cancelled) {
        setLoading(true);
        setError(null);
      }

      try {
        const data = await fetchPage(pageNumber);
        if (!cancelled) {
          setPageData(data);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          console.error(`Error fetching page ${String(pageNumber)}:`, err);
          setError(`Failed to load page ${String(pageNumber)}`);
          setLoading(false);
        }
      }
    };

    void loadPage();

    return () => {
      cancelled = true;
    };
  }, [pageNumber, enabled]);

  return { pageData, loading, error };
}
