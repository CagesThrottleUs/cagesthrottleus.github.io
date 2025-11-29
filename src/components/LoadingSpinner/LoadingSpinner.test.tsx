import { describe, expect, it } from "vitest";

import LoadingSpinner from "./LoadingSpinner";
import { render, screen } from "../../test/testUtils";

describe("LoadingSpinner", () => {
  it("renders loading text", () => {
    render(<LoadingSpinner />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders spinner elements", () => {
    render(<LoadingSpinner />);
    expect(document.querySelector(".loading-spinner")).toBeInTheDocument();
    expect(document.querySelector(".spinner-ring")).toBeInTheDocument();
    expect(document.querySelector(".spinner-ring-inner")).toBeInTheDocument();
  });

  it("has correct container structure", () => {
    render(<LoadingSpinner />);
    expect(document.querySelector(".loading-container")).toBeInTheDocument();
  });
});
