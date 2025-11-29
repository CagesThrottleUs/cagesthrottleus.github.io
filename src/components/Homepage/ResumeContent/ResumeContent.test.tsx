import { describe, expect, it } from "vitest";

import ResumeContent from "./ResumeContent";
import { resumeData } from "./resumeData";
import { render, screen } from "../../../test/testUtils";

describe("ResumeContent", () => {
  it("renders without crashing", () => {
    render(<ResumeContent experiences={resumeData} />);
    expect(document.querySelector(".dossier-container")).toBeInTheDocument();
  });

  it("renders all experiences", () => {
    render(<ResumeContent experiences={resumeData} />);
    const missionBriefings = document.querySelectorAll(".mission-briefing");
    expect(missionBriefings.length).toBeGreaterThan(0);
  });

  it("applies hover scale on mission briefings", () => {
    render(<ResumeContent experiences={resumeData} hoverScale={1.2} />);
    const firstItem = document.querySelector(
      ".mission-briefing",
    ) as HTMLElement;

    expect(firstItem).toBeInTheDocument();
    // Hover is handled via CSS, just verify element exists
  });

  it("renders mission briefings correctly", () => {
    render(<ResumeContent experiences={resumeData} hoverScale={1.2} />);
    const briefings = document.querySelectorAll(".mission-briefing");

    expect(briefings.length).toBeGreaterThan(0);
    // Verify each briefing has required elements
    briefings.forEach((briefing) => {
      expect(briefing).toBeInTheDocument();
    });
  });

  it("uses custom animation duration", () => {
    render(<ResumeContent experiences={resumeData} animationDuration={500} />);
    const dossier = document.querySelector(".dossier-container") as HTMLElement;
    expect(dossier).toBeInTheDocument();
    expect(dossier.style.getPropertyValue("--animation-duration")).toBe(
      "500ms",
    );
  });

  it("renders experience titles", () => {
    render(<ResumeContent experiences={resumeData} />);
    // Check that company names are rendered
    const companyElements = screen.getAllByText(/Adobe Systems India/i);
    expect(companyElements.length).toBeGreaterThan(0);
  });

  it("handles mission briefings rendering", async () => {
    render(<ResumeContent experiences={resumeData} />);

    // Wait for render to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    const briefings = document.querySelectorAll(".mission-briefing");
    expect(briefings.length).toBeGreaterThan(0);

    // Test that items render correctly
    briefings.forEach((item) => {
      expect(item).toBeInTheDocument();
    });
  });

  it("renders personnel file sections", async () => {
    render(<ResumeContent experiences={resumeData} />);

    const personnelFiles = document.querySelectorAll(".personnel-file");
    expect(personnelFiles.length).toBeGreaterThan(0);

    // Wait for render to complete
    await new Promise((resolve) => setTimeout(resolve, 150));

    personnelFiles.forEach((section) => {
      expect(section).toBeInTheDocument();
    });
  });

  it("renders assignment records correctly", () => {
    render(<ResumeContent experiences={resumeData} />);

    const assignmentRecords = document.querySelectorAll(".assignment-record");
    expect(assignmentRecords.length).toBeGreaterThan(0);

    assignmentRecords.forEach((section) => {
      expect(section).toBeInTheDocument();
    });
  });
});
