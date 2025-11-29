import { useState, useEffect } from "react";
import "./LoadingSpinner.css";

/**
 * Cold War Era Teletype Loading Indicator
 * Simulates vintage teletype machine transmitting data
 * Features morse code-like dots and dashes with typewriter aesthetic
 */
const LoadingSpinner = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="loading-container">
      {/* Teletype Message Box */}
      <div className="teletype-box">
        <div className="teletype-header">
          <span className="teletype-label">CLASSIFIED TRANSMISSION</span>
          <span className="teletype-status">█ ACTIVE</span>
        </div>

        {/* ASCII Loading Animation */}
        <div className="teletype-display">
          <pre className="loading-ascii">
            {`
  ╔═══════════════════════════════════╗
  ║          DECRYPTING  FILES        ║
  ╚═══════════════════════════════════╝
`}
          </pre>

          {/* Morse Code Style Loading Bar */}
          <div className="morse-container">
            <div className="morse-line">
              <span className="morse-dot" />
              <span className="morse-dash" />
              <span className="morse-dot" />
              <span className="morse-dash" />
              <span className="morse-dot" />
            </div>
          </div>

          {/* Typewriter Loading Text */}
          <div className="loading-message">
            <span className="loading-prefix">STATUS:</span>
            <span className="loading-text">PROCESSING{dots}</span>
          </div>

          {/* Progress Indicator */}
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div className="progress-fill" />
            </div>
            <div className="progress-markers">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        <div className="teletype-footer">
          <span className="security-notice">TOP SECRET // NOFORN</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
