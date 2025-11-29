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

  it("displays education information", () => {
    render(<Homepage />);
    expect(screen.getByText(/BITS Pilani/i)).toBeInTheDocument();
    expect(screen.getByText(/B.E. in Computer Science/i)).toBeInTheDocument();
  });

  it("displays graduation year and CGPA", () => {
    render(<Homepage />);
    expect(
      screen.getByText(/graduated from BITS Pilani in 2023/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/8.05/i)).toBeInTheDocument();
  });

  it("renders resume content component", () => {
    render(<Homepage />);
    // ResumeContent should render the resume data
    const resumeContent = document.querySelector(".resume-content");
    expect(resumeContent).toBeInTheDocument();
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
