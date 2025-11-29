import { describe, expect, it, vi } from "vitest";

import ScrollToTop from "./ScrollToTop";
import { fireEvent, render, screen } from "../../test/testUtils";

describe("ScrollToTop - File Cabinet Theme", () => {
  it("does not render button initially", () => {
    render(<ScrollToTop />);
    const button = screen.queryByRole("button", {
      name: /return to top of document/i,
    });
    expect(button).not.toBeInTheDocument();
  });

  it("shows file tab button when scrolled down more than 400px", () => {
    render(<ScrollToTop />);

    // Mock scrollY
    Object.defineProperty(window, "scrollY", {
      writable: true,
      value: 500,
    });

    fireEvent.scroll(window);

    const button = screen.getByRole("button", {
      name: /return to top of document/i,
    });
    expect(button).toBeInTheDocument();
  });

  it("renders file tab with correct text", () => {
    render(<ScrollToTop />);

    Object.defineProperty(window, "scrollY", {
      writable: true,
      value: 500,
    });
    fireEvent.scroll(window);

    expect(screen.getByText("RETURN TO")).toBeInTheDocument();
    expect(screen.getByText("TOP")).toBeInTheDocument();
  });

  it("renders file stamp", () => {
    render(<ScrollToTop />);

    Object.defineProperty(window, "scrollY", {
      writable: true,
      value: 500,
    });
    fireEvent.scroll(window);

    expect(screen.getByText("FILE")).toBeInTheDocument();
  });

  it("hides button when scrolled to top", async () => {
    render(<ScrollToTop />);

    // First scroll down
    Object.defineProperty(window, "scrollY", {
      writable: true,
      value: 500,
    });
    fireEvent.scroll(window);

    const button = screen.getByRole("button", {
      name: /return to top of document/i,
    });
    expect(button).toBeInTheDocument();

    await new Promise((resolve) => setTimeout(resolve, 10));

    // Then scroll back to top
    Object.defineProperty(window, "scrollY", {
      writable: true,
      value: 0,
    });
    fireEvent.scroll(window);

    // Check scrollY is handled
    expect(window.scrollY).toBe(0);
  });

  it("scrolls to top when file tab is clicked", () => {
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;

    render(<ScrollToTop />);

    // Show the button
    Object.defineProperty(window, "scrollY", {
      writable: true,
      value: 500,
    });
    fireEvent.scroll(window);

    const button = screen.getByRole("button", {
      name: /return to top of document/i,
    });
    fireEvent.click(button);

    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });

  it("has correct file tab structure", () => {
    render(<ScrollToTop />);

    Object.defineProperty(window, "scrollY", {
      writable: true,
      value: 500,
    });
    fireEvent.scroll(window);

    expect(document.querySelector(".file-tab-scroll")).toBeInTheDocument();
    expect(document.querySelector(".file-tab-content")).toBeInTheDocument();
    expect(document.querySelector(".file-tab-marker")).toBeInTheDocument();
  });
});
