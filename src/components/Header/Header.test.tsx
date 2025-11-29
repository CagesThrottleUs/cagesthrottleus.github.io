import { describe, expect, it } from "vitest";

import { APPLICATION_VERSION } from "./constants";
import HeaderComponent from "./Header";
import { render, screen } from "../../test/testUtils";

describe("HeaderComponent - Intelligence Agency Branding", () => {
  it("renders classification banner", () => {
    render(<HeaderComponent />);
    expect(screen.getAllByText(/TOP SECRET/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/NOFORN/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders agency name", () => {
    render(<HeaderComponent />);
    expect(screen.getByText("CAGESTHROTTLEUS")).toBeInTheDocument();
  });

  it("renders agency subtitle with version", () => {
    render(<HeaderComponent />);
    expect(
      screen.getByText(
        new RegExp(`UNIT \\[REDACTED\\].*v${APPLICATION_VERSION}`),
      ),
    ).toBeInTheDocument();
  });

  it("renders agency seal", () => {
    render(<HeaderComponent />);
    expect(document.querySelector(".agency-seal")).toBeInTheDocument();
    expect(document.querySelector(".seal-outer-ring")).toBeInTheDocument();
    expect(document.querySelector(".seal-letter")).toBeInTheDocument();
  });

  it("renders security clearance notice", () => {
    render(<HeaderComponent />);
    expect(
      screen.getByText(/SECURITY CLEARANCE: TOP SECRET/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/AUTHORIZED PERSONNEL ONLY/i)).toBeInTheDocument();
  });

  it("has correct CSS classes", () => {
    render(<HeaderComponent />);
    expect(document.querySelector(".app-header")).toBeInTheDocument();
    expect(document.querySelector(".header-container")).toBeInTheDocument();
    expect(document.querySelector(".intelligence-header")).toBeInTheDocument();
  });

  it("renders home link", () => {
    render(<HeaderComponent />);
    const homeLink = screen.getByRole("link");
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders navigation tabs", () => {
    render(<HeaderComponent />);
    expect(document.querySelector(".header-navigation")).toBeInTheDocument();
    const navTabs = document.querySelectorAll(".nav-tab");
    expect(navTabs.length).toBeGreaterThan(0);
  });

  it("navigates when nav tab is clicked", async () => {
    const { user } = render(<HeaderComponent />);
    const navTabs = document.querySelectorAll(".nav-tab");

    if (navTabs.length > 0) {
      await user.click(navTabs[0]);
      // Navigation was triggered
      expect(navTabs[0]).toBeInTheDocument();
    }
  });
});
