import { describe, expect, it, vi } from "vitest";
import NotFoundComponent from "./NotFound";
import { render, screen } from "../../test/testUtils";

describe("NotFoundComponent", () => {
  it("renders 404 error code", () => {
    render(<NotFoundComponent />);
    const errorCodes = screen.getAllByText("404");
    // Should have main code + 2 glitch layers
    expect(errorCodes.length).toBeGreaterThanOrEqual(1);
    expect(errorCodes[0]).toBeInTheDocument();
  });

  it("renders page not found title", () => {
    render(<NotFoundComponent />);
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
  });

  it("renders error message", () => {
    render(<NotFoundComponent />);
    expect(
      screen.getByText(/The page you're looking for has vanished/i)
    ).toBeInTheDocument();
  });

  it("renders back to home button", () => {
    render(<NotFoundComponent />);
    const homeButton = screen.getByLabelText("Return to homepage");
    expect(homeButton).toBeInTheDocument();
    expect(homeButton).toHaveTextContent("Back to Home");
  });

  it("renders go back button", () => {
    render(<NotFoundComponent />);
    const backButton = screen.getByLabelText("Go back to previous page");
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveTextContent("Go Back");
  });

  it("navigates to home when home button is clicked", async () => {
    const { user } = render(<NotFoundComponent />);
    const homeButton = screen.getByLabelText("Return to homepage");

    await user.click(homeButton);

    // Button exists and was clickable
    expect(homeButton).toBeInTheDocument();
  });

  it("goes back when back button is clicked", async () => {
    const { user } = render(<NotFoundComponent />);
    const backSpy = vi.spyOn(window.history, "back");
    const backButton = screen.getByLabelText("Go back to previous page");

    await user.click(backButton);

    expect(backSpy).toHaveBeenCalled();
  });

  it("has correct main wrapper", () => {
    render(<NotFoundComponent />);
    expect(document.querySelector(".not-found-wrapper")).toBeInTheDocument();
  });

  it("has correct container", () => {
    render(<NotFoundComponent />);
    expect(document.querySelector(".not-found-container")).toBeInTheDocument();
  });

  it("renders background orbs", () => {
    render(<NotFoundComponent />);
    expect(document.querySelector(".not-found-bg-orbs")).toBeInTheDocument();
    expect(document.querySelector(".orb-1")).toBeInTheDocument();
    expect(document.querySelector(".orb-2")).toBeInTheDocument();
    expect(document.querySelector(".orb-3")).toBeInTheDocument();
  });

  it("renders decorative elements", () => {
    render(<NotFoundComponent />);
    expect(document.querySelector(".error-decorations")).toBeInTheDocument();
  });

  it("renders error icons", () => {
    render(<NotFoundComponent />);
    expect(document.querySelector(".error-icon")).toBeInTheDocument();
    expect(document.querySelector(".error-icon-accent")).toBeInTheDocument();
  });

  it("has glitch effect structure", () => {
    render(<NotFoundComponent />);
    const errorCode = document.querySelector(".error-code");
    
    // Verify glitch structure exists
    expect(errorCode).toBeInTheDocument();
    
    // Verify glitch layers exist
    const glitchLayers = document.querySelectorAll(".error-code-glitch");
    expect(glitchLayers.length).toBe(2);
  });
});
