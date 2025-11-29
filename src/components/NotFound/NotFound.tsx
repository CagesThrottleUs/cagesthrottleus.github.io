import { Square, ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";

import "./NotFound.css";

function NotFoundComponent() {
  const navigate = useNavigate();

  return (
    <div className="not-found-wrapper">
      <div className="classified-document">
        <div className="document-header">
          <div className="classification-bar">TOP SECRET // NOFORN</div>
          <div className="document-meta">
            <span className="doc-number">DOC-404-NFND</span>
            <span className="doc-date">
              CLASSIFIED: {new Date().getFullYear()}
            </span>
          </div>
        </div>

        {/* CLASSIFIED Stamp */}
        <div className="classified-stamp-container">
          <div className="classified-stamp">CLASSIFIED</div>
        </div>

        {/* Error Code as Document Number */}
        <pre className="error-code-ascii">
          {`
  ██╗  ██╗ ██████╗ ██╗  ██╗
  ██║  ██║██╔═████╗██║  ██║
  ███████║██║██╔██║███████║
  ╚════██║████╔╝██║╚════██║
       ██║╚██████╔╝     ██║
       ╚═╝ ╚═════╝      ╚═╝
`}
        </pre>

        {/* Document Body */}
        <div className="document-body">
          <h1 className="document-title">PAGE NOT FOUND</h1>

          <div className="document-section">
            <div className="section-header">
              <Square
                className="section-marker"
                size={14}
                fill="currentColor"
              />
              <span className="section-title">STATUS</span>
            </div>
            <p className="document-text">
              The requested file could not be located in our archives. This file
              may have been:
            </p>
            <ul className="document-list">
              <li>
                <span className="redacted">[REDACTED]</span> RELOCATED TO SECURE
                FACILITY
              </li>
              <li>
                <span className="redacted">[REDACTED]</span> DESTROYED PER
                PROTOCOL
              </li>
              <li>
                <span className="redacted">[REDACTED]</span> NEVER EXISTED
                (DISINFORMATION)
              </li>
              <li>
                <span className="redacted">[REDACTED]</span> ABOVE YOUR
                CLEARANCE LEVEL
              </li>
            </ul>
          </div>

          <div className="document-section">
            <div className="section-header">
              <Square
                className="section-marker"
                size={14}
                fill="currentColor"
              />
              <span className="section-title">RECOMMENDED ACTION</span>
            </div>
            <p className="document-text">
              You are advised to return to headquarters or review previous
              briefing materials.
            </p>
          </div>

          {/* Action Buttons styled as Document Actions */}
          <div className="document-actions">
            <button
              className="action-btn action-btn-primary"
              onClick={() => {
                void navigate("/");
              }}
              aria-label="Return to homepage"
            >
              <ChevronRight className="btn-marker" size={16} />
              RETURN TO HEADQUARTERS
            </button>

            <button
              className="action-btn action-btn-secondary"
              onClick={() => {
                window.history.back();
              }}
              aria-label="Go back to previous page"
            >
              <ChevronLeft className="btn-marker" size={16} />
              PREVIOUS LOCATION
            </button>
          </div>
        </div>

        {/* Document Footer - Classification Markings */}
        <div className="document-footer">
          <div className="classification-bar">TOP SECRET // NOFORN</div>
          <div className="footer-warning">
            UNAUTHORIZED DISCLOSURE SUBJECT TO CRIMINAL SANCTIONS
          </div>
        </div>

        {/* FILE NOT FOUND Stamp */}
        <div className="file-stamp">FILE NOT FOUND</div>
      </div>
    </div>
  );
}

export default NotFoundComponent;
