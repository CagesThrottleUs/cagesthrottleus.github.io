import { act } from "@testing-library/react";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

import LoadingSpinner from "./LoadingSpinner";
import { render, screen } from "../../test/testUtils";

describe("LoadingSpinner - Teletype Theme", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });
  it("renders teletype classification header", () => {
    render(<LoadingSpinner />);
    expect(screen.getByText("CLASSIFIED TRANSMISSION")).toBeInTheDocument();
  });

  it("renders PROCESSING status text", () => {
    render(<LoadingSpinner />);
    expect(screen.getByText(/PROCESSING/i)).toBeInTheDocument();
  });

  it("renders ASCII art message", () => {
    render(<LoadingSpinner />);
    const asciiArt = document.querySelector(".loading-ascii");
    expect(asciiArt).toBeInTheDocument();
    expect(asciiArt?.textContent).toContain("DECRYPTING");
    expect(asciiArt?.textContent).toContain("FILES");
  });

  it("renders morse code indicators", () => {
    render(<LoadingSpinner />);
    const morseDots = document.querySelectorAll(".morse-dot");
    const morseDashes = document.querySelectorAll(".morse-dash");
    expect(morseDots.length).toBeGreaterThan(0);
    expect(morseDashes.length).toBeGreaterThan(0);
  });

  it("renders progress bar", () => {
    render(<LoadingSpinner />);
    expect(document.querySelector(".progress-bar")).toBeInTheDocument();
    expect(document.querySelector(".progress-fill")).toBeInTheDocument();
  });

  it("renders security classification footer", () => {
    render(<LoadingSpinner />);
    expect(screen.getByText(/TOP SECRET \/\/ NOFORN/i)).toBeInTheDocument();
  });

  it("has correct teletype structure", () => {
    render(<LoadingSpinner />);
    expect(document.querySelector(".loading-container")).toBeInTheDocument();
    expect(document.querySelector(".teletype-box")).toBeInTheDocument();
    expect(document.querySelector(".teletype-header")).toBeInTheDocument();
  });

  it("renders active status indicator", () => {
    render(<LoadingSpinner />);
    expect(screen.getByText(/ACTIVE/i)).toBeInTheDocument();
  });

  it("animates dots in PROCESSING text", async () => {
    render(<LoadingSpinner />);

    // Initial state - should show "PROCESSING" with no dots
    expect(screen.getByText(/PROCESSING/i)).toBeInTheDocument();

    // Advance timer to trigger dot additions (tests prev + "." branch)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(screen.getByText(/PROCESSING\./i)).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(screen.getByText(/PROCESSING\.\./i)).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(screen.getByText(/PROCESSING\.\.\./i)).toBeInTheDocument();

    // Advance timer to trigger reset (tests prev.length >= 3 ? "" branch)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    // After reset, back to no dots
    const textElement = screen.getByText(/PROCESSING/i);
    expect(textElement.textContent).not.toContain("...");
  });
});
