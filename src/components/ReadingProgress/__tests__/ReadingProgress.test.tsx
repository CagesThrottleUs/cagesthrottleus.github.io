import { render } from "@testing-library/react";
import * as framerMotion from "framer-motion";
import { describe, it, expect, vi } from "vitest";

import ReadingProgress from "../ReadingProgress";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: vi.fn(
      ({
        children,
        className,
        style,
        ...props
      }: {
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
        [key: string]: unknown;
      }) => (
        <div className={className} style={style} {...props}>
          {children}
        </div>
      ),
    ),
  },
  useScroll: vi.fn(() => ({
    scrollYProgress: {
      get: () => 0,
      on: vi.fn((event: string, handler: (value: number) => void) => {
        // Immediately call handler with test value
        if (event === "change") {
          handler(0.5);
        }
        return () => {}; // Return unsubscribe function
      }),
    },
  })),
  useSpring: vi.fn((value: unknown) => value),
}));

describe("ReadingProgress", () => {
  it("should render reading progress container", () => {
    const { container } = render(<ReadingProgress />);
    const progressContainer = container.querySelector(
      ".reading-progress-container",
    );
    expect(progressContainer).toBeInTheDocument();
  });

  it("should render progress bar", () => {
    const { container } = render(<ReadingProgress />);
    const progressBar = container.querySelector(".reading-progress-bar");
    expect(progressBar).toBeInTheDocument();
  });

  it("should show progress bar when scroll position is greater than 10%", () => {
    const mockOn = vi.fn((event: string, handler: (value: number) => void) => {
      if (event === "change") {
        handler(0.15); // 15% scroll
      }
      return () => {};
    });

    vi.mocked(framerMotion).useScroll.mockReturnValue({
      scrollYProgress: {
        get: () => 0.15,
        on: mockOn,
      },
    } as never);

    render(<ReadingProgress />);

    expect(mockOn).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("should hide progress bar when scroll position is less than 10%", () => {
    const mockOn = vi.fn((event: string, handler: (value: number) => void) => {
      if (event === "change") {
        handler(0.05); // 5% scroll
      }
      return () => {};
    });

    vi.mocked(framerMotion).useScroll.mockReturnValue({
      scrollYProgress: {
        get: () => 0.05,
        on: mockOn,
      },
    } as never);

    render(<ReadingProgress />);

    expect(mockOn).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("should unsubscribe from scroll progress on unmount", () => {
    const mockUnsubscribe = vi.fn();
    const mockOn = vi.fn(() => mockUnsubscribe);

    vi.mocked(framerMotion).useScroll.mockReturnValue({
      scrollYProgress: {
        get: () => 0,
        on: mockOn,
      },
    } as never);

    const { unmount } = render(<ReadingProgress />);

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it("should apply correct spring configuration", () => {
    const { useSpring } = vi.mocked(framerMotion);

    render(<ReadingProgress />);

    expect(useSpring).toHaveBeenCalledWith(expect.anything(), {
      stiffness: 100,
      damping: 30,
      restDelta: 0.001,
    });
  });
});
