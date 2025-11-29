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

    setLoading(true);
    setError(null);

    fetchPage(pageNumber)
      .then((data) => {
        setPageData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(`Error fetching page ${pageNumber}:`, err);
        setError(`Failed to load page ${pageNumber}`);
        setLoading(false);
      });
  }, [pageNumber, enabled]);

  return { pageData, loading, error };
}

