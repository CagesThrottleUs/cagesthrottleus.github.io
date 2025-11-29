import { describe, expect, it } from "vitest";

import CursorTracker from "./CursorTracker";
import { fireEvent, render, waitFor } from "../../test/testUtils";

describe("CursorTracker", () => {
  it("renders cursor tracker element", () => {
    render(<CursorTracker />);
    const tracker = document.querySelector(".cursor-tracker");
    expect(tracker).toBeInTheDocument();
  });

  it("updates position on mouse move", async () => {
    const { container } = render(<CursorTracker />);
    const tracker = document.querySelector(".cursor-tracker") as HTMLElement;

    // Fire event on a real DOM element
    fireEvent.mouseMove(container, { clientX: 100, clientY: 200 });

    // Wait for requestAnimationFrame to execute
    await waitFor(() => {
      expect(tracker.style.getPropertyValue("--cursor-x")).toBe("100px");
      expect(tracker.style.getPropertyValue("--cursor-y")).toBe("200px");
    });
  });

  it("remains visible by default", async () => {
    const { container } = render(<CursorTracker />);
    const tracker = document.querySelector(".cursor-tracker") as HTMLElement;

    // Trigger a mouse move on regular element
    fireEvent.mouseMove(container, { clientX: 50, clientY: 50 });

    // Wait for requestAnimationFrame to execute
    await waitFor(() => {
      expect(tracker.style.opacity).toBe("1");
    });
  });

  it("hides when hovering over no-cursor-track elements", async () => {
    const { container } = render(
      <div>
        <CursorTracker />
        <div className="no-cursor-track" data-testid="no-track">
          No Track Area
        </div>
      </div>,
    );

    const noTrackElement = container.querySelector(
      ".no-cursor-track",
    ) as HTMLElement;
    const tracker = document.querySelector(".cursor-tracker") as HTMLElement;

    fireEvent.mouseMove(noTrackElement, { clientX: 50, clientY: 50 });

    // Wait for requestAnimationFrame to execute
    await waitFor(() => {
      expect(tracker.style.opacity).toBe("0");
    });
  });

  it("shows cursor when not over no-cursor-track elements", async () => {
    const { container } = render(
      <div>
        <CursorTracker />
        <div data-testid="regular">Regular Area</div>
      </div>,
    );

    const regularElement = container.querySelector(
      '[data-testid="regular"]',
    ) as HTMLElement;
    const tracker = document.querySelector(".cursor-tracker") as HTMLElement;

    fireEvent.mouseMove(regularElement, { clientX: 150, clientY: 150 });

    // Wait for requestAnimationFrame to execute
    await waitFor(() => {
      expect(tracker.style.opacity).toBe("1");
    });
  });

  it("cancels previous animation frame on rapid mouse moves", async () => {
    const { container } = render(<CursorTracker />);
    const tracker = document.querySelector(".cursor-tracker") as HTMLElement;

    // Fire multiple mouse move events rapidly to trigger cancelAnimationFrame
    fireEvent.mouseMove(container, { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(container, { clientX: 20, clientY: 20 });
    fireEvent.mouseMove(container, { clientX: 30, clientY: 30 });
    fireEvent.mouseMove(container, { clientX: 40, clientY: 40 });

    // Wait for the last requestAnimationFrame to execute
    await waitFor(() => {
      expect(tracker.style.getPropertyValue("--cursor-x")).toBe("40px");
      expect(tracker.style.getPropertyValue("--cursor-y")).toBe("40px");
    });
  });
});
