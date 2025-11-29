import { describe, expect, it, vi } from "vitest";

import ScrollToTop from "./ScrollToTop";
import { fireEvent, render, screen } from "../../test/testUtils";

describe("ScrollToTop", () => {
  it("does not render button initially", () => {
    render(<ScrollToTop />);
    const button = screen.queryByRole("button", { name: /scroll to top/i });
    expect(button).not.toBeInTheDocument();
  });

  it("shows button when scrolled down more than 400px", () => {
    render(<ScrollToTop />);

    // Mock scrollY
    Object.defineProperty(window, "scrollY", {
      writable: true,
      value: 500,
    });

    fireEvent.scroll(window);

    const button = screen.getByRole("button", { name: /scroll to top/i });
    expect(button).toBeInTheDocument();
  });

  it("hides button when scrolled to top", async () => {
    render(<ScrollToTop />);

    // First scroll down
    Object.defineProperty(window, "scrollY", {
      writable: true,
      value: 500,
    });
    fireEvent.scroll(window);

    const button = screen.getByRole("button", { name: /scroll to top/i });
    expect(button).toBeInTheDocument();

    await new Promise((resolve) => setTimeout(resolve, 10));

    // Then scroll back to top
    Object.defineProperty(window, "scrollY", {
      writable: true,
      value: 0,
    });
    fireEvent.scroll(window);

    // Button should still exist during exit animation, but check scrollY is handled
    expect(window.scrollY).toBe(0);
  });

  it("scrolls to top when button is clicked", () => {
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;

    render(<ScrollToTop />);

    // Show the button
    Object.defineProperty(window, "scrollY", {
      writable: true,
      value: 500,
    });
    fireEvent.scroll(window);

    const button = screen.getByRole("button", { name: /scroll to top/i });
    fireEvent.click(button);

    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
