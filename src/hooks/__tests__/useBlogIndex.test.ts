import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import * as blogService from "../../services/blogService";
import { useBlogIndex } from "../useBlogIndex";

vi.mock("../../services/blogService");

describe("useBlogIndex", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch blog index on mount", async () => {
    const mockIndex = {
      version: "2025-11-29",
      totalPosts: 2,
      totalPages: 1,
      postsPerPage: 50,
      latestPosts: [],
      pages: {},
    };

    vi.spyOn(blogService, "fetchBlogIndex").mockResolvedValue(mockIndex);

    const { result } = renderHook(() => useBlogIndex());

    expect(result.current.loading).toBe(true);
    expect(result.current.index).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.index).toEqual(mockIndex);
    expect(result.current.error).toBeNull();
  });

  it("should handle fetch errors", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    vi.spyOn(blogService, "fetchBlogIndex").mockRejectedValue(
      new Error("Network error"),
    );

    const { result } = renderHook(() => useBlogIndex());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Failed to load blog index");
    expect(result.current.index).toBeNull();

    consoleErrorSpy.mockRestore();
  });
});
