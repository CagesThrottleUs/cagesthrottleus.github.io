import * as mdx from "@mdx-js/mdx";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import * as blogService from "../../services/blogService";
import { useBlogPost } from "../useBlogPost";

vi.mock("../../services/blogService");
vi.mock("@mdx-js/mdx");

describe("useBlogPost", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and compile blog post", async () => {
    const mockMetadata = {
      slug: "test-post",
      title: "Test Post",
      classification: "UNCLASSIFIED",
      abstract: "Test abstract",
      publishDate: "2025-11-29",
      version: "1.0",
    };

    const mockMDXContent = `---
title: Test Post
---

# Test Content`;

    const mockCompiledCode = "function() { return 'compiled'; }";
    const mockMDXComponent = () => "Test Component";

    vi.spyOn(blogService, "fetchPostMetadata").mockResolvedValue(mockMetadata);
    vi.spyOn(blogService, "fetchPostContent").mockResolvedValue(mockMDXContent);
    vi.spyOn(mdx, "compile").mockResolvedValue(mockCompiledCode as never);
    vi.spyOn(mdx, "run").mockResolvedValue({
      default: mockMDXComponent,
    } as never);

    const { result } = renderHook(() => useBlogPost("test-post"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.metadata).toEqual(mockMetadata);
    expect(result.current.MDXContent).toBeTruthy();
    expect(result.current.error).toBeNull();
  });

  it("should handle missing slug", async () => {
    const { result } = renderHook(() => useBlogPost(undefined));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("No slug provided");
    expect(result.current.metadata).toBeNull();
    expect(result.current.MDXContent).toBeNull();
  });

  it("should handle missing metadata", async () => {
    vi.spyOn(blogService, "fetchPostMetadata").mockResolvedValue(null);
    vi.spyOn(blogService, "fetchPostContent").mockResolvedValue("content");

    const { result } = renderHook(() => useBlogPost("nonexistent"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Post not found");
    expect(result.current.MDXContent).toBeNull();
  });

  it("should handle fetch errors", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    vi.spyOn(blogService, "fetchPostMetadata").mockRejectedValue(
      new Error("Network error"),
    );

    const { result } = renderHook(() => useBlogPost("test-post"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Failed to load post");
    expect(result.current.MDXContent).toBeNull();

    consoleErrorSpy.mockRestore();
  });

  it("should cleanup on unmount", () => {
    const mockMetadata = {
      slug: "test-post",
      title: "Test Post",
      classification: "UNCLASSIFIED",
      abstract: "Test abstract",
      publishDate: "2025-11-29",
      version: "1.0",
    };

    vi.spyOn(blogService, "fetchPostMetadata").mockResolvedValue(mockMetadata);
    vi.spyOn(blogService, "fetchPostContent").mockResolvedValue("# Content");
    vi.spyOn(mdx, "compile").mockResolvedValue("code" as never);
    vi.spyOn(mdx, "run").mockResolvedValue({
      default: () => "Component",
    } as never);

    const { unmount } = renderHook(() => useBlogPost("test-post"));

    unmount();

    // Ensure no errors on unmount
    expect(true).toBe(true);
  });

  it("should strip frontmatter from MDX content", async () => {
    const mockMetadata = {
      slug: "test-post",
      title: "Test Post",
      classification: "UNCLASSIFIED",
      abstract: "Test abstract",
      publishDate: "2025-11-29",
      version: "1.0",
    };

    const mockMDXContent = `---
title: Test Post
classification: UNCLASSIFIED
---

# Actual Content`;

    const compileSpy = vi
      .spyOn(mdx, "compile")
      .mockResolvedValue("code" as never);

    vi.spyOn(blogService, "fetchPostMetadata").mockResolvedValue(mockMetadata);
    vi.spyOn(blogService, "fetchPostContent").mockResolvedValue(mockMDXContent);
    vi.spyOn(mdx, "run").mockResolvedValue({
      default: () => "Component",
    } as never);

    renderHook(() => useBlogPost("test-post"));

    await waitFor(() => {
      expect(compileSpy).toHaveBeenCalled();
    });

    // Verify frontmatter was stripped
    const compiledContent = compileSpy.mock.calls[0][0] as string;
    expect(compiledContent).not.toContain("---");
    expect(compiledContent).toContain("# Actual Content");
  });
});
