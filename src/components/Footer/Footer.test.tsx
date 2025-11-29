import { describe, expect, it } from "vitest";

import FooterComponent from "./Footer";
import { render, screen } from "../../test/testUtils";

describe("FooterComponent", () => {
  it("renders footer text correctly", () => {
    render(<FooterComponent />);
    expect(screen.getByText(/Built with/i)).toBeInTheDocument();
    expect(screen.getByText(/CagesThrottleUs/i)).toBeInTheDocument();
  });

  it("renders heart icon", () => {
    render(<FooterComponent />);
    const heartIcon = document.querySelector(".footer-heart");
    expect(heartIcon).toBeInTheDocument();
  });

  it("has correct CSS classes", () => {
    render(<FooterComponent />);
    expect(document.querySelector(".app-footer")).toBeInTheDocument();
    expect(document.querySelector(".footer-container")).toBeInTheDocument();
    expect(document.querySelector(".text-footer")).toBeInTheDocument();
  });

  it("includes copyright notice", () => {
    render(<FooterComponent />);
    expect(screen.getByText(/Forever & always/i)).toBeInTheDocument();
  });
});
