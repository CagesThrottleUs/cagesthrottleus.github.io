import { describe, expect, it, vi } from "vitest";

import KeyboardShortcuts from "./KeyboardShortcuts";
import { fireEvent, render } from "../../test/testUtils";

describe("KeyboardShortcuts", () => {
  it("renders without visible output", () => {
    const { container } = render(<KeyboardShortcuts />);
    expect(container.firstChild).toBeNull();
  });

  it("scrolls to top when Home key is pressed", () => {
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;

    render(<KeyboardShortcuts />);

    const event = new KeyboardEvent("keydown", {
      key: "Home",
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    fireEvent(window, event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });

  it("scrolls to bottom when End key is pressed", () => {
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;

    // Mock scrollHeight
    Object.defineProperty(document.documentElement, "scrollHeight", {
      writable: true,
      value: 2000,
    });

    render(<KeyboardShortcuts />);

    const event = new KeyboardEvent("keydown", {
      key: "End",
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    fireEvent(window, event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(scrollToMock).toHaveBeenCalledWith({
      top: 2000,
      behavior: "smooth",
    });
  });

  it("does not scroll on other key presses", () => {
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;

    render(<KeyboardShortcuts />);

    fireEvent.keyDown(window, { key: "a" });
    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.keyDown(window, { key: "Enter" });

    expect(scrollToMock).not.toHaveBeenCalled();
  });
});
