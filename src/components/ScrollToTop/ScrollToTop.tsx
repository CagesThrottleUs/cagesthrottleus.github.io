import { ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

import "./ScrollToTop.css";

/**
 * Cold War Era File Cabinet - Return to Top
 * Styled as vintage file cabinet tab from intelligence archives
 * Features classified filing system aesthetic with document reference
 */
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      className="file-tab-scroll"
      onClick={scrollToTop}
      aria-label="Return to top of document"
    >
      <div className="file-tab-content">
        <ChevronUp className="file-tab-marker" size={20} />
        <div className="file-tab-text">
          <span className="file-tab-label">RETURN TO</span>
          <span className="file-tab-action">TOP</span>
        </div>
      </div>
      <div className="file-tab-stamp">FILE</div>
    </button>
  );
};

export default ScrollToTop;
