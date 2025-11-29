import { useState, useEffect } from "react";
import { fetchBlogIndex } from "../services/blogService";
import type { BlogIndex } from "../types/blog";

/**
 * Custom hook to fetch and manage blog index
 * Handles loading state and error handling
 */
export function useBlogIndex() {
  const [index, setIndex] = useState<BlogIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogIndex()
      .then((data) => {
        setIndex(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blog index:", err);
        setError("Failed to load blog index");
        setLoading(false);
      });
  }, []);

  return { index, loading, error };
}

