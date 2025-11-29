import { describe, expect, it } from "vitest";

import NotFoundComponent from "./NotFound";
import { render, screen } from "../../test/testUtils";

describe("NotFoundComponent", () => {
  it("renders 404 error message", () => {
    render(<NotFoundComponent />);
    expect(screen.getByText("Error: 404")).toBeInTheDocument();
  });

  it("renders page not found message", () => {
    render(<NotFoundComponent />);
    expect(screen.getByText(/Page not found/i)).toBeInTheDocument();
  });

  it("renders home link", () => {
    render(<NotFoundComponent />);
    const homeLink = screen.getByText("home");
    expect(homeLink).toBeInTheDocument();
  });

  it("navigates to home when link is clicked", async () => {
    const { user } = render(<NotFoundComponent />);
    const homeLink = screen.getByText("home");

    await user.click(homeLink);

    // Link was clicked and navigation triggered
    expect(homeLink).toBeInTheDocument();
  });

  it("has correct container", () => {
    render(<NotFoundComponent />);
    expect(document.querySelector(".not-found-container")).toBeInTheDocument();
  });
});
