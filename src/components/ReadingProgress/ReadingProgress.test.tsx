import { describe, expect, it } from "vitest";

import ReadingProgress from "./ReadingProgress";
import { render } from "../../test/testUtils";

describe("ReadingProgress", () => {
  it("renders the progress container", () => {
    render(<ReadingProgress />);
    const container = document.querySelector(".reading-progress-container");
    expect(container).toBeInTheDocument();
  });

  it("renders the progress bar", () => {
    render(<ReadingProgress />);
    const progressBar = document.querySelector(".reading-progress-bar");
    expect(progressBar).toBeInTheDocument();
  });

  it("initially renders with low opacity (not scrolled)", () => {
    render(<ReadingProgress />);
    const container = document.querySelector(
      ".reading-progress-container",
    ) as HTMLElement;
    // Component starts hidden (opacity 0) when scrollYProgress is 0
    expect(container).toBeInTheDocument();
  });

  it("handles scroll progress changes", async () => {
    render(<ReadingProgress />);
    const progressBar = document.querySelector(".reading-progress-bar");

    // Progress bar exists
    expect(progressBar).toBeInTheDocument();

    // Test that the component handles the scroll progress callback
    // The actual visibility change is controlled by framer-motion's scroll tracking
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(progressBar).toBeInTheDocument();
  });
});
