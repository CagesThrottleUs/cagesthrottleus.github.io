import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import BlogCard from "../BlogCard";

import type { BlogMetadata } from "../../../types/blog";

describe("BlogCard", () => {
  const mockMetadata: BlogMetadata = {
    slug: "test-post",
    title: "Test Post Title",
    classification: "TOP SECRET",
    abstract: "This is a test abstract for the blog post.",
    publishDate: "2025-11-29",
    version: "1.0",
    thumbnail: "thumbnails/test.jpg",
  };

  it("should render blog card with metadata", () => {
    const onClick = vi.fn();
    render(<BlogCard metadata={mockMetadata} onClick={onClick} />);

    expect(screen.getByText("Test Post Title")).toBeInTheDocument();
    expect(screen.getByText("TOP SECRET")).toBeInTheDocument();
    expect(screen.getByText("2025-11-29")).toBeInTheDocument();
    expect(screen.getByText("v1.0")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test abstract for the blog post."),
    ).toBeInTheDocument();
    expect(screen.getByText("READ BRIEFING")).toBeInTheDocument();
  });

  it("should handle click events", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<BlogCard metadata={mockMetadata} onClick={onClick} />);

    const card = screen.getByRole("button");
    await user.click(card);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should handle keyboard events (Enter)", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<BlogCard metadata={mockMetadata} onClick={onClick} />);

    const card = screen.getByRole("button");
    card.focus();
    await user.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should handle keyboard events (Space)", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<BlogCard metadata={mockMetadata} onClick={onClick} />);

    const card = screen.getByRole("button");
    card.focus();
    await user.keyboard(" ");

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should render with default thumbnail when not provided", () => {
    const metadataWithoutThumbnail: BlogMetadata = {
      ...mockMetadata,
      thumbnail: undefined,
    };
    const onClick = vi.fn();

    render(<BlogCard metadata={metadataWithoutThumbnail} onClick={onClick} />);

    const img: HTMLImageElement = screen.getByAltText("Test Post Title");
    expect(img.src).toContain("thumbnails/default.svg");
  });

  it("should render image with correct src", () => {
    const onClick = vi.fn();
    render(<BlogCard metadata={mockMetadata} onClick={onClick} />);

    const img: HTMLImageElement = screen.getByAltText("Test Post Title");
    expect(img.src).toContain("thumbnails/test.jpg");
  });
});
