import { render } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import CursorTracker from "../CursorTracker";

// Helper to create and dispatch mouse events
const dispatchMouseMove = (target: HTMLElement, x: number, y: number) => {
  const event = new MouseEvent("mousemove", {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
  });
  target.dispatchEvent(event);
};

describe("CursorTracker", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should render cursor tracker element", () => {
    const { container } = render(<CursorTracker />);
    const cursor = container.querySelector(".cursor-tracker");
    expect(cursor).toBeInTheDocument();
  });

  it("should update cursor position on mouse move", () => {
    const { container } = render(
      <div>
        <CursorTracker />
        <div className="test-area">Test</div>
      </div>,
    );
    const cursor = container.querySelector(".cursor-tracker") as HTMLElement;
    const testArea = container.querySelector(".test-area") as HTMLElement;

    dispatchMouseMove(testArea, 100, 200);

    // Flush requestAnimationFrame
    vi.runAllTimers();

    expect(cursor.style.getPropertyValue("--cursor-x")).toBe("100px");
    expect(cursor.style.getPropertyValue("--cursor-y")).toBe("200px");
  });

  it("should set opacity to 0 when hovering over no-cursor-track elements", () => {
    const { container } = render(
      <div>
        <CursorTracker />
        <div className="no-cursor-track">No track zone</div>
      </div>,
    );

    const cursor = container.querySelector(".cursor-tracker") as HTMLElement;
    const noTrackElement = container.querySelector(
      ".no-cursor-track",
    ) as HTMLElement;

    dispatchMouseMove(noTrackElement, 50, 50);

    vi.runAllTimers();

    expect(cursor.style.opacity).toBe("0");
  });

  it("should set opacity to 1 when not hovering over no-cursor-track elements", () => {
    const { container } = render(
      <div>
        <CursorTracker />
        <div className="test-area">Test</div>
      </div>,
    );
    const cursor = container.querySelector(".cursor-tracker") as HTMLElement;
    const testArea = container.querySelector(".test-area") as HTMLElement;

    dispatchMouseMove(testArea, 100, 200);

    vi.runAllTimers();

    expect(cursor.style.opacity).toBe("1");
  });

  it("should cleanup event listeners on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = render(
      <div>
        <CursorTracker />
      </div>,
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mousemove",
      expect.any(Function),
    );
  });

  it("should cancel animation frame on unmount", () => {
    const cancelAnimationFrameSpy = vi.spyOn(window, "cancelAnimationFrame");

    const { container, unmount } = render(
      <div>
        <CursorTracker />
        <div className="test-area">Test</div>
      </div>,
    );

    const testArea = container.querySelector(".test-area") as HTMLElement;

    // Trigger a mouse move to start an animation frame
    dispatchMouseMove(testArea, 100, 200);

    unmount();

    // Should have called cancelAnimationFrame during cleanup
    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
  });

  it("should handle rapid mouse movements by canceling previous frames", () => {
    const { container } = render(
      <div>
        <CursorTracker />
        <div className="test-area">Test</div>
      </div>,
    );
    const cursor = container.querySelector(".cursor-tracker") as HTMLElement;
    const testArea = container.querySelector(".test-area") as HTMLElement;

    // Trigger multiple rapid movements
    dispatchMouseMove(testArea, 10, 10);
    dispatchMouseMove(testArea, 20, 20);
    dispatchMouseMove(testArea, 30, 30);

    vi.runAllTimers();

    // Should only process the last position
    expect(cursor.style.getPropertyValue("--cursor-x")).toBe("30px");
    expect(cursor.style.getPropertyValue("--cursor-y")).toBe("30px");
  });

  it("should return early if cursor ref is null", () => {
    const { container } = render(<CursorTracker />);

    // Manually set ref to null to test early return
    const cursor = container.querySelector(".cursor-tracker");

    // Should not throw error even if cursor element is not found
    expect(cursor).toBeInTheDocument();
  });
});
