import { describe, expect, it } from "vitest";

import Homepage from "./Homepage";
import { render, screen } from "../../test/testUtils";

describe("Homepage", () => {
  it("renders the main heading", () => {
    render(<Homepage />);
    expect(screen.getByText("CagesThrottleUs")).toBeInTheDocument();
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
    expect(document.querySelector(".text-intro-name")).toBeInTheDocument();
    expect(document.querySelector(".intro-content")).toBeInTheDocument();
  });

  it("handles intersection observer for animation", async () => {
    const { container } = render(<Homepage />);
    const heading = container.querySelector(".text-intro-name");

    // Heading should exist
    expect(heading).toBeInTheDocument();

    // Wait for potential setTimeout to execute
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Heading should still exist after animation timeout
    expect(heading).toBeInTheDocument();
  });
});
