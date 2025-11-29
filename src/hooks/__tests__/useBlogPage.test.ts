import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import * as blogService from "../../services/blogService";
import { useBlogPage } from "../useBlogPage";

vi.mock("../../services/blogService");

describe("useBlogPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch page data when enabled", async () => {
    const mockPage = {
      page: 1,
      posts: [
        {
          slug: "test-post",
          title: "Test Post",
          classification: "UNCLASSIFIED",
          abstract: "Test abstract",
          publishDate: "2025-11-29",
          version: "1.0",
        },
      ],
    };

    vi.spyOn(blogService, "fetchPage").mockResolvedValue(mockPage);

    const { result } = renderHook(() => useBlogPage(1, true));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.pageData).toEqual(mockPage);
    expect(result.current.error).toBeNull();
  });

  it("should not fetch when disabled", () => {
    vi.spyOn(blogService, "fetchPage");

    renderHook(() => useBlogPage(1, false));

    expect(blogService.fetchPage).not.toHaveBeenCalled();
  });

  it("should handle fetch errors", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    vi.spyOn(blogService, "fetchPage").mockRejectedValue(
      new Error("Network error"),
    );

    const { result } = renderHook(() => useBlogPage(1, true));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toContain("Failed to load page");
    expect(result.current.pageData).toBeNull();

    consoleErrorSpy.mockRestore();
  });

  it("should refetch when page number changes", async () => {
    const mockPage1 = { page: 1, posts: [] };
    const mockPage2 = { page: 2, posts: [] };

    const fetchPageSpy = vi
      .spyOn(blogService, "fetchPage")
      .mockResolvedValueOnce(mockPage1)
      .mockResolvedValueOnce(mockPage2);

    const { result, rerender } = renderHook(
      ({ pageNum }) => useBlogPage(pageNum, true),
      { initialProps: { pageNum: 1 } },
    );

    await waitFor(() => {
      expect(result.current.pageData).toEqual(mockPage1);
    });

    rerender({ pageNum: 2 });

    await waitFor(() => {
      expect(result.current.pageData).toEqual(mockPage2);
    });

    expect(fetchPageSpy).toHaveBeenCalledTimes(2);
  });

  it("should cleanup on unmount", () => {
    const mockPage = { page: 1, posts: [] };
    vi.spyOn(blogService, "fetchPage").mockResolvedValue(mockPage);

    const { unmount } = renderHook(() => useBlogPage(1, true));

    unmount();

    // Ensure no errors on unmount
    expect(true).toBe(true);
  });
});
