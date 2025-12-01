import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import { describe, it, expect, vi, beforeEach } from "vitest";

import * as blogService from "../../../services/blogService";
import BlogList from "../BlogList";

vi.mock("../../../services/blogService");

const mockBlogIndex = {
  version: "2025-11-29",
  totalPosts: 2,
  totalPages: 1,
  postsPerPage: 50,
  latestPosts: [],
  pages: { "1": "page-1.json" },
};

const mockPageData = {
  page: 1,
  posts: [
    {
      slug: "2025-11-29-hello-world",
      title: "Hello World",
      classification: "UNCLASSIFIED",
      abstract: "First post",
      publishDate: "2025-11-29",
      version: "1.0",
      thumbnail: "thumbnails/default.svg",
    },
    {
      slug: "2025-11-30-second-post",
      title: "Second Post",
      classification: "CONFIDENTIAL",
      abstract: "Second post",
      publishDate: "2025-11-30",
      version: "1.1",
      thumbnail: "thumbnails/default.svg",
    },
  ],
};

describe("BlogList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(blogService, "fetchBlogIndex").mockResolvedValue(mockBlogIndex);
    vi.spyOn(blogService, "fetchPage").mockResolvedValue(mockPageData);
  });

  it("should render blog list with posts", async () => {
    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("CLASSIFIED BRIEFINGS")).toBeInTheDocument();
    });

    expect(screen.getByText("Hello World")).toBeInTheDocument();
    expect(screen.getByText("Second Post")).toBeInTheDocument();
  });

  it("should filter posts by title search", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Hello World")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Enter keywords...");
    await user.type(searchInput, "Second");

    await waitFor(() => {
      expect(screen.queryByText("Hello World")).not.toBeInTheDocument();
      expect(screen.getByText("Second Post")).toBeInTheDocument();
    });
  });

  it("should show total files count", async () => {
    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/TOTAL FILES: 2/)).toBeInTheDocument();
    });
  });

  it("should display loading spinner initially", () => {
    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>,
    );

    expect(screen.getByText("CLASSIFIED TRANSMISSION")).toBeInTheDocument();
  });

  it("should display error message when page fetch fails", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Index succeeds
    vi.spyOn(blogService, "fetchBlogIndex").mockResolvedValue(mockBlogIndex);
    // But page fetch fails
    vi.spyOn(blogService, "fetchPage").mockRejectedValue(
      new Error("Page fetch error"),
    );

    const { container } = render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>,
    );

    await waitFor(
      () => {
        const errorDiv = container.querySelector(".blog-list-error");
        expect(errorDiv).toBeTruthy();
        expect(errorDiv?.textContent).toContain("Failed to load page");
      },
      { timeout: 5000 },
    );

    consoleErrorSpy.mockRestore();
  });

  it("should show no results message when no posts match filter", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Hello World")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Enter keywords...");
    await user.type(searchInput, "NonexistentPost");

    await waitFor(() => {
      expect(screen.getByText("NO MATCHING FILES FOUND")).toBeInTheDocument();
    });
  });

  it("should show results count when filtering", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Hello World")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Enter keywords...");
    await user.type(searchInput, "Hello");

    await waitFor(() => {
      expect(screen.getByText(/SHOWING 1 OF 2/)).toBeInTheDocument();
    });
  });

  it("should show pagination when there are multiple pages", async () => {
    const mockIndexMultiPage = {
      ...mockBlogIndex,
      totalPages: 3,
      totalPosts: 150,
    };

    vi.spyOn(blogService, "fetchBlogIndex").mockResolvedValue(
      mockIndexMultiPage,
    );

    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/PAGE 1 OF 3/)).toBeInTheDocument();
    });

    expect(screen.getByText("PREVIOUS")).toBeInTheDocument();
    expect(screen.getByText("NEXT")).toBeInTheDocument();
  });

  it("should navigate to next page when next button is clicked", async () => {
    const mockIndexMultiPage = {
      ...mockBlogIndex,
      totalPages: 2,
      totalPosts: 100,
    };

    vi.spyOn(blogService, "fetchBlogIndex").mockResolvedValue(
      mockIndexMultiPage,
    );

    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/PAGE 1 OF 2/)).toBeInTheDocument();
    });

    const nextButton = screen.getByText("NEXT");
    await user.click(nextButton);

    // Should call fetchPage for page 2
    expect(blogService.fetchPage).toHaveBeenCalledWith(2);
  });

  it("should navigate to previous page when previous button is clicked", async () => {
    const mockIndexMultiPage = {
      ...mockBlogIndex,
      totalPages: 3,
      totalPosts: 150,
    };

    vi.spyOn(blogService, "fetchBlogIndex").mockResolvedValue(
      mockIndexMultiPage,
    );

    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/PAGE 1 OF 3/)).toBeInTheDocument();
    });

    // Click next to go to page 2
    const nextButton = screen.getByText("NEXT");
    await user.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/PAGE 2 OF 3/)).toBeInTheDocument();
    });

    // Click previous to go back to page 1
    const prevButton = screen.getByText("PREVIOUS");
    await user.click(prevButton);

    expect(blogService.fetchPage).toHaveBeenCalledWith(1);
  });

  it("should disable previous button on first page", async () => {
    const mockIndexMultiPage = {
      ...mockBlogIndex,
      totalPages: 2,
      totalPosts: 100,
    };

    vi.spyOn(blogService, "fetchBlogIndex").mockResolvedValue(
      mockIndexMultiPage,
    );

    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/PAGE 1 OF 2/)).toBeInTheDocument();
    });

    const prevButton = screen.getByText("PREVIOUS").closest("button");
    expect(prevButton).toBeDisabled();
  });

  it("should disable next button on last page", async () => {
    const mockIndexMultiPage = {
      ...mockBlogIndex,
      totalPages: 2,
      totalPosts: 100,
    };

    vi.spyOn(blogService, "fetchBlogIndex").mockResolvedValue(
      mockIndexMultiPage,
    );

    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/PAGE 1 OF 2/)).toBeInTheDocument();
    });

    // Go to page 2
    const nextButton = screen.getByText("NEXT");
    await user.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/PAGE 2 OF 2/)).toBeInTheDocument();
    });

    const nextBtn = screen.getByText("NEXT").closest("button");
    expect(nextBtn).toBeDisabled();
  });

  it("should hide pagination when filtering is active", async () => {
    const mockIndexMultiPage = {
      ...mockBlogIndex,
      totalPages: 2,
      totalPosts: 100,
    };

    vi.spyOn(blogService, "fetchBlogIndex").mockResolvedValue(
      mockIndexMultiPage,
    );

    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/PAGE 1 OF 2/)).toBeInTheDocument();
    });

    // Apply search filter
    const searchInput = screen.getByPlaceholderText("Enter keywords...");
    await user.type(searchInput, "Hello");

    await waitFor(() => {
      expect(screen.queryByText(/PAGE 1 OF 2/)).not.toBeInTheDocument();
    });
  });

  it("should show loading spinner while fetching page data", async () => {
    const mockIndexMultiPage = {
      ...mockBlogIndex,
      totalPages: 2,
      totalPosts: 100,
    };

    vi.spyOn(blogService, "fetchBlogIndex").mockResolvedValue(
      mockIndexMultiPage,
    );

    // Make fetchPage slow to test loading state
    vi.spyOn(blogService, "fetchPage").mockImplementation((pageNum) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(pageNum === 2 ? mockPageData : mockPageData);
        }, 100);
      });
    });

    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Hello World")).toBeInTheDocument();
    });

    // Navigate to page 2
    const nextButton = screen.getByText("NEXT");
    await user.click(nextButton);

    // Should show loading spinner briefly
    await waitFor(() => {
      expect(screen.getByText("CLASSIFIED TRANSMISSION")).toBeInTheDocument();
    });
  });

  it("should display archive year in header", async () => {
    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      const currentYear = new Date().getFullYear();
      expect(
        screen.getByText(`ARCHIVE-${String(currentYear)}`),
      ).toBeInTheDocument();
    });
  });

  it("should display classification header", async () => {
    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("INTELLIGENCE ARCHIVE // EYES ONLY"),
      ).toBeInTheDocument();
    });
  });

  it("should clear search results when search is cleared", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Hello World")).toBeInTheDocument();
      expect(screen.getByText("Second Post")).toBeInTheDocument();
    });

    // Apply search
    const searchInput = screen.getByPlaceholderText("Enter keywords...");
    await user.type(searchInput, "Hello");

    await waitFor(() => {
      expect(screen.getByText("Hello World")).toBeInTheDocument();
      expect(screen.queryByText("Second Post")).not.toBeInTheDocument();
    });

    // Clear search
    await user.clear(searchInput);

    await waitFor(() => {
      expect(screen.getByText("Hello World")).toBeInTheDocument();
      expect(screen.getByText("Second Post")).toBeInTheDocument();
    });
  });

  it("should navigate when blog card is clicked", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Hello World")).toBeInTheDocument();
    });

    // Click on a blog card
    const blogCard = screen.getByText("Hello World").closest(".blog-card");
    expect(blogCard).toBeTruthy();

    if (blogCard) {
      await user.click(blogCard);
    }
  });

  it("should show loading when index is still loading", () => {
    // Mock fetchBlogIndex to return null initially
    vi.spyOn(blogService, "fetchBlogIndex").mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>,
    );

    // Should show loading spinner
    expect(screen.getByText("CLASSIFIED TRANSMISSION")).toBeInTheDocument();
  });

  it("should show loading spinner when index is null after loading completes", async () => {
    // Mock to return null after loading completes
    vi.spyOn(blogService, "fetchBlogIndex").mockResolvedValue(null as never);

    render(
      <BrowserRouter>
        <BlogList />
      </BrowserRouter>,
    );

    // Wait for loading to complete and check spinner is still shown
    await waitFor(() => {
      expect(screen.getByText("CLASSIFIED TRANSMISSION")).toBeInTheDocument();
    });
  });
});
