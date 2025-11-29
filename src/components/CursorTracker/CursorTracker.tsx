import { useEffect, useState } from "react";
import "./CursorTracker.css";

function CursorTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isOverNoTrack = !!target.closest(".no-cursor-track");

      // Hide cursor tracker when over no-cursor-track elements
      setIsVisible(!isOverNoTrack);

      // Always update position for smooth transitions
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className="cursor-tracker"
      style={{
        left: `${position.x.toString()}px`,
        top: `${position.y.toString()}px`,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 150ms ease-out",
      }}
    />
  );
}

export default CursorTracker;
