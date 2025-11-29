import { describe, expect, it } from "vitest";

import Homepage from "./Homepage";
import { render, screen } from "../../test/testUtils";

describe("Homepage", () => {
  it("renders the ASCII art name container", () => {
    render(<Homepage />);
    const asciiArt = document.querySelector(".ascii-art-name");
    expect(asciiArt).toBeInTheDocument();
  });

  it("renders intro content", () => {
    render(<Homepage />);
    expect(
      screen.getByText(/I like to code and keep learning/i),
    ).toBeInTheDocument();
  });

  it("renders dossier title", () => {
    render(<Homepage />);
    expect(
      screen.getByText(/CLASSIFIED PERSONNEL DOSSIER/i),
    ).toBeInTheDocument();
  });

  it("renders resume content component", () => {
    render(<Homepage />);
    // ResumeContent should render the resume data with new dossier structure
    const dossierContainer = document.querySelector(".dossier-container");
    expect(dossierContainer).toBeInTheDocument();
  });

  it("renders personnel files", () => {
    render(<Homepage />);
    const personnelFiles = document.querySelector(".personnel-files");
    expect(personnelFiles).toBeInTheDocument();
  });

  it("has correct CSS classes", () => {
    render(<Homepage />);
    expect(document.querySelector(".homepage-intro")).toBeInTheDocument();
    expect(document.querySelector(".ascii-art-name")).toBeInTheDocument();
    expect(document.querySelector(".ascii-text")).toBeInTheDocument();
    expect(document.querySelector(".intro-content")).toBeInTheDocument();
  });

  it("renders ASCII art with CLASSIFIED label", () => {
    render(<Homepage />);
    const asciiText = document.querySelector(".ascii-text");
    expect(asciiText).toBeInTheDocument();
    // Check that the ASCII art contains the CLASSIFIED label
    expect(asciiText?.textContent).toContain("CLASSIFIED");
  });
});
