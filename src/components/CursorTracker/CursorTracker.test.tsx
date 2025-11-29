import { describe, expect, it } from "vitest";

import CursorTracker from "./CursorTracker";
import { fireEvent, render } from "../../test/testUtils";

describe("CursorTracker", () => {
  it("renders cursor tracker element", () => {
    render(<CursorTracker />);
    const tracker = document.querySelector(".cursor-tracker");
    expect(tracker).toBeInTheDocument();
  });

  it("updates position on mouse move", () => {
    const { container } = render(<CursorTracker />);
    const tracker = document.querySelector(".cursor-tracker") as HTMLElement;

    // Fire event on a real DOM element
    fireEvent.mouseMove(container, { clientX: 100, clientY: 200 });

    expect(tracker.style.left).toBe("100px");
    expect(tracker.style.top).toBe("200px");
  });

  it("remains visible by default", () => {
    const { container } = render(<CursorTracker />);
    const tracker = document.querySelector(".cursor-tracker") as HTMLElement;

    // Trigger a mouse move on regular element
    fireEvent.mouseMove(container, { clientX: 50, clientY: 50 });

    expect(tracker.style.opacity).toBe("1");
  });

  it("hides when hovering over no-cursor-track elements", () => {
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

    expect(tracker.style.opacity).toBe("0");
  });

  it("shows cursor when not over no-cursor-track elements", () => {
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

    expect(tracker.style.opacity).toBe("1");
  });
});
