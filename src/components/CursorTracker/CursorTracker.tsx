import { useEffect, useRef } from "react";
import "./CursorTracker.css";

function CursorTracker() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isOverNoTrack = !!target.closest(".no-cursor-track");

      // Cancel previous frame to prevent queue buildup
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      // Use requestAnimationFrame to batch DOM updates efficiently
      animationFrameId = requestAnimationFrame(() => {
        // Use CSS custom properties for GPU-accelerated transform
        cursor.style.setProperty('--cursor-x', `${e.clientX}px`);
        cursor.style.setProperty('--cursor-y', `${e.clientY}px`);
        cursor.style.opacity = isOverNoTrack ? '0' : '1';
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="cursor-tracker"
    />
  );
}

export default CursorTracker;
