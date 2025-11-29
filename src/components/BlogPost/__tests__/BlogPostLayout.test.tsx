import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import { describe, it, expect, vi, beforeEach } from "vitest";

import * as useBlogPostHook from "../../../hooks/useBlogPost";
import BlogPostLayout from "../BlogPostLayout";

const mockNavigate = vi.fn();

vi.mock("../../../hooks/useBlogPost");
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useParams: () => ({ slug: "test-post" }),
    useNavigate: () => mockNavigate,
  };
});

describe("BlogPostLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  it("should render loading spinner while loading", () => {
    vi.spyOn(useBlogPostHook, "useBlogPost").mockReturnValue({
      MDXContent: null,
      metadata: null,
      loading: true,
      error: null,
    });

    render(
      <BrowserRouter>
        <BlogPostLayout />
      </BrowserRouter>,
    );

    expect(screen.getByText("CLASSIFIED TRANSMISSION")).toBeInTheDocument();
  });

  it("should render not found component on error", () => {
    vi.spyOn(useBlogPostHook, "useBlogPost").mockReturnValue({
      MDXContent: null,
      metadata: null,
      loading: false,
      error: "Post not found",
    });

    render(
      <BrowserRouter>
        <BlogPostLayout />
      </BrowserRouter>,
    );

    expect(screen.getByText("PAGE NOT FOUND")).toBeInTheDocument();
  });

  it("should render blog post with metadata", () => {
    const mockMetadata = {
      slug: "test-post",
      title: "OPERATION TEST: MISSION BRIEFING",
      classification: "TOP SECRET // NOFORN",
      abstract: "This is a test briefing for operational purposes.",
      publishDate: "2025-11-29",
      version: "1.5",
    };

    const MockMDXContent = () => <div>Test MDX Content</div>;

    vi.spyOn(useBlogPostHook, "useBlogPost").mockReturnValue({
      MDXContent: MockMDXContent,
      metadata: mockMetadata,
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <BlogPostLayout />
      </BrowserRouter>,
    );

    expect(
      screen.getByText("OPERATION TEST: MISSION BRIEFING"),
    ).toBeInTheDocument();
    expect(screen.getAllByText("TOP SECRET // NOFORN")).toHaveLength(2); // Header and footer
    expect(
      screen.getByText("This is a test briefing for operational purposes."),
    ).toBeInTheDocument();
    expect(screen.getByText("Test MDX Content")).toBeInTheDocument();
    expect(screen.getByText("DOC-test-post")).toBeInTheDocument();
    expect(screen.getByText("CLASSIFIED: 2025-11-29")).toBeInTheDocument();
    expect(screen.getByText("VERSION: 1.5")).toBeInTheDocument();
  });

  it("should render return to archive button", () => {
    const mockMetadata = {
      slug: "test-post",
      title: "Test Post",
      classification: "UNCLASSIFIED",
      abstract: "Test abstract",
      publishDate: "2025-11-29",
      version: "1.0",
    };

    const MockMDXContent = () => <div>Content</div>;

    vi.spyOn(useBlogPostHook, "useBlogPost").mockReturnValue({
      MDXContent: MockMDXContent,
      metadata: mockMetadata,
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <BlogPostLayout />
      </BrowserRouter>,
    );

    expect(screen.getByText("RETURN TO ARCHIVE")).toBeInTheDocument();
  });

  it("should navigate back on return to archive click", async () => {
    const mockMetadata = {
      slug: "test-post",
      title: "Test Post",
      classification: "UNCLASSIFIED",
      abstract: "Test abstract",
      publishDate: "2025-11-29",
      version: "1.0",
    };

    const MockMDXContent = () => <div>Content</div>;

    vi.spyOn(useBlogPostHook, "useBlogPost").mockReturnValue({
      MDXContent: MockMDXContent,
      metadata: mockMetadata,
      loading: false,
      error: null,
    });

    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <BlogPostLayout />
      </BrowserRouter>,
    );

    const returnButton = screen.getByText("RETURN TO ARCHIVE");
    await user.click(returnButton);

    expect(mockNavigate).toHaveBeenCalledWith("/blog");
  });

  it("should render executive summary section", () => {
    const mockMetadata = {
      slug: "test-post",
      title: "Test Post",
      classification: "UNCLASSIFIED",
      abstract: "Executive summary content here",
      publishDate: "2025-11-29",
      version: "1.0",
    };

    const MockMDXContent = () => <div>Content</div>;

    vi.spyOn(useBlogPostHook, "useBlogPost").mockReturnValue({
      MDXContent: MockMDXContent,
      metadata: mockMetadata,
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <BlogPostLayout />
      </BrowserRouter>,
    );

    expect(screen.getByText("EXECUTIVE SUMMARY")).toBeInTheDocument();
    expect(
      screen.getByText("Executive summary content here"),
    ).toBeInTheDocument();
  });

  it("should render classified stamp", () => {
    const mockMetadata = {
      slug: "test-post",
      title: "Test Post",
      classification: "UNCLASSIFIED",
      abstract: "Test abstract",
      publishDate: "2025-11-29",
      version: "1.0",
    };

    const MockMDXContent = () => <div>Content</div>;

    vi.spyOn(useBlogPostHook, "useBlogPost").mockReturnValue({
      MDXContent: MockMDXContent,
      metadata: mockMetadata,
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <BlogPostLayout />
      </BrowserRouter>,
    );

    expect(screen.getByText("CLASSIFIED")).toBeInTheDocument();
  });

  it("should render footer warning", () => {
    const mockMetadata = {
      slug: "test-post",
      title: "Test Post",
      classification: "UNCLASSIFIED",
      abstract: "Test abstract",
      publishDate: "2025-11-29",
      version: "1.0",
    };

    const MockMDXContent = () => <div>Content</div>;

    vi.spyOn(useBlogPostHook, "useBlogPost").mockReturnValue({
      MDXContent: MockMDXContent,
      metadata: mockMetadata,
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <BlogPostLayout />
      </BrowserRouter>,
    );

    expect(
      screen.getByText("UNAUTHORIZED DISCLOSURE SUBJECT TO CRIMINAL SANCTIONS"),
    ).toBeInTheDocument();
  });
});
