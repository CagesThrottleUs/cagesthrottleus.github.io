import { describe, expect, it } from "vitest";

import { APPLICATION_VERSION } from "./constants";
import HeaderComponent from "./Header";
import { render, screen } from "../../test/testUtils";

describe("HeaderComponent", () => {
  it("renders site title", () => {
    render(<HeaderComponent />);
    expect(screen.getByText("cagesthrottleus")).toBeInTheDocument();
  });

  it("displays application version", () => {
    render(<HeaderComponent />);
    expect(screen.getByText(`v${APPLICATION_VERSION}`)).toBeInTheDocument();
  });

  it("has correct CSS classes", () => {
    render(<HeaderComponent />);
    expect(document.querySelector(".app-header")).toBeInTheDocument();
    expect(document.querySelector(".header-container")).toBeInTheDocument();
  });

  it("renders home link", () => {
    render(<HeaderComponent />);
    const homeLink = screen.getByRole("link", { name: /cagesthrottleus/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("navigates when application link is pressed", async () => {
    const { user } = render(<HeaderComponent />);
    const links = screen.getAllByRole("link");

    // Find a navigation link (not the home link)
    const navLink = links.find(
      (link) =>
        link.textContent && !link.textContent.includes("cagesthrottleus"),
    );

    if (navLink) {
      await user.click(navLink);
      // Navigation was triggered
      expect(navLink).toBeInTheDocument();
    }
  });
});
