import { AlertTriangle } from "lucide-react";

import "./Footer.css";

/**
 * Cold War Era Classified Document Footer
 * Styled as end-of-document classification markings and signature block
 * Features document authenticity markers and security notices
 */
function FooterComponent() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="app-footer footer-container no-cursor-track">
      <footer className="classified-footer">
        {/* Classification Bar */}
        <div className="footer-classification-bar">
          <span className="classification-left">TOP SECRET // NOFORN</span>
          <span className="classification-right">TOP SECRET // NOFORN</span>
        </div>

        {/* Document Signature Block */}
        <div className="signature-block">
          <div className="signature-line">
            <span className="signature-label">PREPARED BY:</span>
            <span className="signature-name">CAGESTHROTTLEUS</span>
          </div>

          <div className="signature-line">
            <span className="signature-label">AUTHORITY:</span>
            <span className="signature-value">EXECUTIVE ORDER 12958</span>
          </div>

          <div className="signature-line">
            <span className="signature-label">DECLASSIFIED:</span>
            <span className="signature-value">NEVER &copy; {currentYear}</span>
          </div>
        </div>

        {/* Security Notice */}
        <div className="security-warning">
          <AlertTriangle className="warning-marker" size={14} />
          <span className="warning-text">
            UNAUTHORIZED DISCLOSURE SUBJECT TO CRIMINAL SANCTIONS
          </span>
          <AlertTriangle className="warning-marker" size={14} />
        </div>

        {/* Document Reference Number */}
        <div className="document-reference">
          DOC-{currentYear}-PORTFOLIO-CLASSIFIED
        </div>
      </footer>
    </div>
  );
}

export default FooterComponent;
