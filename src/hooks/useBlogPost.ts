import { compile, run } from "@mdx-js/mdx";
import { useEffect, useState } from "react";
import * as runtime from "react/jsx-runtime";

import { fetchPostContent, fetchPostMetadata } from "../services/blogService";

import type { BlogMetadata } from "../types/blog";

// Type for MDX components that can be passed to compiled MDX
interface MDXContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components?: Record<string, React.ComponentType<any>>;
}

/**
 * Custom hook to fetch and compile a blog post from MDX
 * Handles metadata fetching, MDX compilation, and error states
 */
export function useBlogPost(slug: string | undefined) {
  const [MDXContent, setMDXContent] =
    useState<React.ComponentType<MDXContentProps> | null>(null);
  const [metadata, setMetadata] = useState<BlogMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadPost = async () => {
      if (!slug) {
        if (!cancelled) {
          setLoading(false);
          setError("No slug provided");
        }
        return;
      }

      if (!cancelled) {
        setLoading(true);
        setError(null);
      }

      try {
        const [meta, mdxSource] = await Promise.all([
          fetchPostMetadata(slug),
          fetchPostContent(slug),
        ]);

        if (!meta) {
          if (!cancelled) {
            setError("Post not found");
            setLoading(false);
          }
          return;
        }

        // Strip frontmatter from MDX content (everything between --- markers)
        const contentWithoutFrontmatter = mdxSource.replace(
          /^---\n.*?\n---\n/s,
          "",
        );

        // Compile MDX to JavaScript
        const code = String(
          await compile(contentWithoutFrontmatter, {
            outputFormat: "function-body",
            development: false,
          }),
        );

        // Execute compiled code and get component
        const { default: Content } = await run(code, {
          ...runtime,
          baseUrl: import.meta.url,
        });

        // Update state only if not cancelled
        if (!cancelled) {
          setMetadata(meta);
          // Type assertion since MDX runtime returns a component accepting our props
          setMDXContent(() => Content as React.ComponentType<MDXContentProps>);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          console.error("Error loading post:", err);
          setError("Failed to load post");
          setLoading(false);
        }
      }
    };

    void loadPost();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { MDXContent, metadata, loading, error };
}
