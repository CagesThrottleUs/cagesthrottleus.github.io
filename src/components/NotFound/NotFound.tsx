import { Home, AlertTriangle, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./NotFound.css";

function NotFoundComponent() {
  const navigate = useNavigate();
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    // Trigger random glitch effects
    const glitchInterval = setInterval(
      () => {
        setGlitchActive(true);
        setTimeout(() => {
          setGlitchActive(false);
        }, 200);
      },
      3000 + Math.random() * 2000,
    );

    return () => {
      clearInterval(glitchInterval);
    };
  }, []);

  return (
    <div className="not-found-wrapper">
      {/* Animated Background Elements */}
      <div className="not-found-bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="not-found-grid" />

      <div className="not-found-container">
        {/* Main Error Display */}
        <div className="error-display">
          <div className={`error-code ${glitchActive ? "glitch" : ""}`}>
            <span className="error-code-main">404</span>
            <span className="error-code-glitch" aria-hidden="true">
              404
            </span>
            <span className="error-code-glitch" aria-hidden="true">
              404
            </span>
          </div>

          <div className="error-icon-container">
            <AlertTriangle className="error-icon" size={48} />
            <Zap className="error-icon-accent" size={24} />
          </div>

          <h1 className="error-title">
            <span className={glitchActive ? "glitch-text" : ""}>
              Page Not Found
            </span>
          </h1>

          <p className="error-message">
            The page you&apos;re looking for has vanished into the digital void.
            <br />
            It might have been moved, deleted, or never existed.
          </p>

          {/* Action Buttons */}
          <div className="error-actions">
            <button
              className="error-btn error-btn-primary"
              onClick={() => {
                void navigate("/");
              }}
              aria-label="Return to homepage"
            >
              <Home size={20} />
              <span>Back to Home</span>
            </button>

            <button
              className="error-btn error-btn-secondary"
              onClick={() => {
                window.history.back();
              }}
              aria-label="Go back to previous page"
            >
              <span>Go Back</span>
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="error-decorations">
          <div className="decoration-line line-1" />
          <div className="decoration-line line-2" />
          <div className="decoration-line line-3" />
          <div className="decoration-circle circle-1" />
          <div className="decoration-circle circle-2" />
        </div>
      </div>
    </div>
  );
}

export default NotFoundComponent;
