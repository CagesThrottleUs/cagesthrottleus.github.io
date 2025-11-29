import { Lock, Square } from "lucide-react";
import { Link } from "react-aria-components";
import { useNavigate } from "react-router";

import { APPLICATION_VERSION, SUPPORTED_APPLICATIONS } from "./constants";

import "./Header.css";

/**
 * Cold War Era Intelligence Agency Header
 * Styled as classified document header with agency branding
 * Features security clearance level and navigation tabs
 */
function HeaderComponent() {
  const navigate = useNavigate();

  return (
    <div className="app-header header-container no-cursor-track">
      <header className="intelligence-header">
        {/* Classification Banner */}
        <div className="header-classification-banner">
          <span className="banner-left">TOP SECRET</span>
          <span className="banner-center">CLASSIFIED MATERIAL</span>
          <span className="banner-right">NOFORN</span>
        </div>

        {/* Agency Header */}
        <div className="agency-header">
          {/* Agency Seal & Branding */}
          <div className="agency-branding">
            <Link href="/" className="agency-link">
              <div className="agency-seal">
                <div className="seal-outer-ring" />
                <div className="seal-inner-content">
                  <span className="seal-letter">C</span>
                </div>
              </div>
              <div className="agency-info">
                <h1 className="agency-name">CAGESTHROTTLEUS</h1>
                <span className="agency-subtitle">
                  UNIT [REDACTED] | v{APPLICATION_VERSION}
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Tabs */}
          <nav className="header-navigation">
            {SUPPORTED_APPLICATIONS.map((application) => (
              <button
                key={application.url}
                className="nav-tab"
                onClick={() => {
                  void navigate(application.url);
                }}
                aria-label={`Navigate to ${application.name}`}
              >
                <Square className="tab-marker" size={12} fill="currentColor" />
                <span className="tab-label">
                  {application.name.toUpperCase()}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Security Clearance Notice */}
        <div className="clearance-notice">
          <Lock className="clearance-icon" size={14} />
          <span className="clearance-text">SECURITY CLEARANCE: TOP SECRET</span>
          <span className="clearance-separator">|</span>
          <span className="clearance-access">AUTHORIZED PERSONNEL ONLY</span>
        </div>
      </header>
    </div>
  );
}

export default HeaderComponent;
