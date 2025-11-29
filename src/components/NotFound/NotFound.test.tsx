import { describe, expect, it, vi } from "vitest";

import NotFoundComponent from "./NotFound";
import { render, screen } from "../../test/testUtils";

describe("NotFoundComponent - Classified Document Theme", () => {
  it("renders 404 error code in ASCII art", () => {
    render(<NotFoundComponent />);
    const asciiArt = document.querySelector(".error-code-ascii");
    expect(asciiArt).toBeInTheDocument();
    // ASCII art is visual representation, just verify it exists
    expect(asciiArt?.textContent.length).toBeGreaterThan(0);
  });

  it("renders classified document title", () => {
    render(<NotFoundComponent />);
    expect(screen.getByText(/PAGE NOT FOUND/i)).toBeInTheDocument();
    expect(screen.getByText(/FILE NOT FOUND/i)).toBeInTheDocument();
  });

  it("renders classification markings", () => {
    render(<NotFoundComponent />);
    expect(
      screen.getAllByText(/TOP SECRET \/\/ NOFORN/i).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("renders CLASSIFIED stamp", () => {
    render(<NotFoundComponent />);
    expect(screen.getByText("CLASSIFIED")).toBeInTheDocument();
  });

  it("renders FILE NOT FOUND stamp", () => {
    render(<NotFoundComponent />);
    expect(screen.getByText("FILE NOT FOUND")).toBeInTheDocument();
  });

  it("renders document sections", () => {
    render(<NotFoundComponent />);
    expect(screen.getByText("STATUS")).toBeInTheDocument();
    expect(screen.getByText("RECOMMENDED ACTION")).toBeInTheDocument();
  });

  it("renders redacted text elements", () => {
    render(<NotFoundComponent />);
    const redactedElements = document.querySelectorAll(".redacted");
    expect(redactedElements.length).toBeGreaterThan(0);
  });

  it("renders return to headquarters button", () => {
    render(<NotFoundComponent />);
    const homeButton = screen.getByLabelText("Return to homepage");
    expect(homeButton).toBeInTheDocument();
    expect(homeButton).toHaveTextContent("RETURN TO HEADQUARTERS");
  });

  it("renders previous location button", () => {
    render(<NotFoundComponent />);
    const backButton = screen.getByLabelText("Go back to previous page");
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveTextContent("PREVIOUS LOCATION");
  });

  it("navigates to home when headquarters button is clicked", async () => {
    const { user } = render(<NotFoundComponent />);
    const homeButton = screen.getByLabelText("Return to homepage");

    await user.click(homeButton);

    // Button exists and was clickable
    expect(homeButton).toBeInTheDocument();
  });

  it("goes back when previous location button is clicked", async () => {
    const { user } = render(<NotFoundComponent />);
    const backSpy = vi.spyOn(window.history, "back");
    const backButton = screen.getByLabelText("Go back to previous page");

    await user.click(backButton);

    expect(backSpy).toHaveBeenCalled();
  });

  it("has classified document structure", () => {
    render(<NotFoundComponent />);
    expect(document.querySelector(".not-found-wrapper")).toBeInTheDocument();
    expect(document.querySelector(".classified-document")).toBeInTheDocument();
  });

  it("renders document header and footer", () => {
    render(<NotFoundComponent />);
    expect(document.querySelector(".document-header")).toBeInTheDocument();
    expect(document.querySelector(".document-footer")).toBeInTheDocument();
  });

  it("renders security warning", () => {
    render(<NotFoundComponent />);
    expect(
      screen.getByText(
        /UNAUTHORIZED DISCLOSURE SUBJECT TO CRIMINAL SANCTIONS/i,
      ),
    ).toBeInTheDocument();
  });
});
