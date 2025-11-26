import { useEffect, useState } from "react";
import "./CursorTracker.css";

function CursorTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
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
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    />
  );
}

export default CursorTracker;

