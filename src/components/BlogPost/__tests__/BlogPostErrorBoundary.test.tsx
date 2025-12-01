import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import BlogPostErrorBoundary from "../BlogPostErrorBoundary";

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test rendering error");
  }
  return <div>Normal content</div>;
};

describe("BlogPostErrorBoundary", () => {
  beforeEach(() => {
    // Suppress console.error in tests
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render children when no error occurs", () => {
    render(
      <BlogPostErrorBoundary>
        <div>Test content</div>
      </BlogPostErrorBoundary>,
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("should render error UI when child component throws", () => {
    render(
      <BlogPostErrorBoundary>
        <ThrowError shouldThrow />
      </BlogPostErrorBoundary>,
    );

    expect(screen.getByText("Document Rendering Failed")).toBeInTheDocument();
    expect(
      screen.getByText(
        /An error occurred while rendering this classified document/,
      ),
    ).toBeInTheDocument();
  });

  it("should display error message in technical details", () => {
    render(
      <BlogPostErrorBoundary>
        <ThrowError shouldThrow />
      </BlogPostErrorBoundary>,
    );

    expect(screen.getByText("Technical Details")).toBeInTheDocument();
    expect(screen.getByText("Test rendering error")).toBeInTheDocument();
  });

  it("should render custom fallback when provided", () => {
    const customFallback = <div>Custom error message</div>;

    render(
      <BlogPostErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow />
      </BlogPostErrorBoundary>,
    );

    expect(screen.getByText("Custom error message")).toBeInTheDocument();
    expect(
      screen.queryByText("Document Rendering Failed"),
    ).not.toBeInTheDocument();
  });

  it("should log error to console via componentDidCatch", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <BlogPostErrorBoundary>
        <ThrowError shouldThrow />
      </BlogPostErrorBoundary>,
    );

    // React Error Boundary logs errors - just verify it was called
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it("should have error stamp in default error UI", () => {
    render(
      <BlogPostErrorBoundary>
        <ThrowError shouldThrow />
      </BlogPostErrorBoundary>,
    );

    const errorStamp = screen.getByText("ERROR");
    expect(errorStamp).toBeInTheDocument();
    expect(errorStamp).toHaveClass("error-stamp");
  });

  it("should not render error UI when error is not thrown", () => {
    render(
      <BlogPostErrorBoundary>
        <ThrowError shouldThrow={false} />
      </BlogPostErrorBoundary>,
    );

    expect(screen.getByText("Normal content")).toBeInTheDocument();
    expect(
      screen.queryByText("Document Rendering Failed"),
    ).not.toBeInTheDocument();
  });
});
