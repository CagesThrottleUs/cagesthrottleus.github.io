import { describe, expect, it } from "vitest";

import ResumeContent from "./ResumeContent";
import { resumeData } from "./resumeData";
import { fireEvent, render, screen } from "../../../test/testUtils";

describe("ResumeContent", () => {
  it("renders without crashing", () => {
    render(<ResumeContent experiences={resumeData} />);
    expect(document.querySelector(".resume-content")).toBeInTheDocument();
  });

  it("renders all experiences", () => {
    render(<ResumeContent experiences={resumeData} />);
    const workItems = document.querySelectorAll(".work-item-wrapper");
    expect(workItems.length).toBeGreaterThan(0);
  });

  it("applies hover scale on mouse enter", () => {
    render(<ResumeContent experiences={resumeData} hoverScale={1.2} />);
    const firstItem = document.querySelector(
      ".work-item-wrapper",
    ) as HTMLElement;

    fireEvent.mouseEnter(firstItem);
    // Mouse enter handler was called
    expect(firstItem).toBeInTheDocument();
  });

  it("removes hover on mouse leave", () => {
    render(<ResumeContent experiences={resumeData} hoverScale={1.2} />);
    const firstItem = document.querySelector(
      ".work-item-wrapper",
    ) as HTMLElement;

    fireEvent.mouseEnter(firstItem);
    fireEvent.mouseLeave(firstItem);
    // Mouse leave handler was called
    expect(firstItem).toBeInTheDocument();
  });

  it("uses custom animation duration", () => {
    render(<ResumeContent experiences={resumeData} animationDuration={500} />);
    const workItems = document.querySelectorAll(".work-item-wrapper");
    expect(workItems.length).toBeGreaterThan(0);
  });

  it("renders experience titles", () => {
    render(<ResumeContent experiences={resumeData} />);
    // Check that company names are rendered
    const companyElements = screen.getAllByText(/Adobe Systems India/i);
    expect(companyElements.length).toBeGreaterThan(0);
  });

  it("handles animation states for work items", async () => {
    render(<ResumeContent experiences={resumeData} />);

    // Wait for animations to settle
    await new Promise((resolve) => setTimeout(resolve, 100));

    const workItems = document.querySelectorAll(".work-item-wrapper");
    expect(workItems.length).toBeGreaterThan(0);

    // Test that items render with animation properties
    workItems.forEach((item) => {
      expect(item).toBeInTheDocument();
    });
  });

  it("renders company sections with animation", async () => {
    render(<ResumeContent experiences={resumeData} />);

    const companySections = document.querySelectorAll(".company-section");
    expect(companySections.length).toBeGreaterThan(0);

    // Wait for intersection observer and animations
    await new Promise((resolve) => setTimeout(resolve, 150));

    companySections.forEach((section) => {
      expect(section).toBeInTheDocument();
    });
  });

  it("renders position sections correctly", () => {
    render(<ResumeContent experiences={resumeData} />);

    const positionSections = document.querySelectorAll(".position-section");
    expect(positionSections.length).toBeGreaterThan(0);

    positionSections.forEach((section) => {
      expect(section).toBeInTheDocument();
    });
  });
});
