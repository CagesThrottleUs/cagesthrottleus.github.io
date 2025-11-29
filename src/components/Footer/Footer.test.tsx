import { describe, expect, it } from "vitest";

import FooterComponent from "./Footer";
import { render, screen } from "../../test/testUtils";

describe("FooterComponent - Classified Document Signature", () => {
  it("renders classification bars", () => {
    render(<FooterComponent />);
    expect(
      screen.getAllByText(/TOP SECRET \/\/ NOFORN/i).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("renders signature block with agent name", () => {
    render(<FooterComponent />);
    expect(screen.getByText("CAGESTHROTTLEUS")).toBeInTheDocument();
  });

  it("renders prepared by label", () => {
    render(<FooterComponent />);
    expect(screen.getByText("PREPARED BY:")).toBeInTheDocument();
  });

  it("renders authority information", () => {
    render(<FooterComponent />);
    expect(screen.getByText("AUTHORITY:")).toBeInTheDocument();
    expect(screen.getByText("EXECUTIVE ORDER 12958")).toBeInTheDocument();
  });

  it("renders declassification notice", () => {
    render(<FooterComponent />);
    expect(screen.getByText("DECLASSIFIED:")).toBeInTheDocument();
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`NEVER.*${String(currentYear)}`)),
    ).toBeInTheDocument();
  });

  it("renders security warning", () => {
    render(<FooterComponent />);
    expect(
      screen.getByText(
        /UNAUTHORIZED DISCLOSURE SUBJECT TO CRIMINAL SANCTIONS/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders document reference number", () => {
    render(<FooterComponent />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`DOC-${String(currentYear)}-PORTFOLIO-CLASSIFIED`),
    ).toBeInTheDocument();
  });

  it("has correct CSS structure", () => {
    render(<FooterComponent />);
    expect(document.querySelector(".app-footer")).toBeInTheDocument();
    expect(document.querySelector(".footer-container")).toBeInTheDocument();
    expect(document.querySelector(".classified-footer")).toBeInTheDocument();
  });
});
