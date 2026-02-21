import { useState, useEffect } from "react";

/**
 * Global Loading Indicator.
 * Displays a thin progress bar at the very top of the screen.
 * Listens for 'loading-start' and 'loading-end' events.
 */
export default function LoadingBar() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;

    const start = () => {
      setLoading(true);
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 5;
        });
      }, 200);
    };

    const stop = () => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
        if (interval) clearInterval(interval);
      }, 300);
    };

    window.addEventListener("loading-start", start);
    window.addEventListener("loading-end", stop);

    return () => {
      window.removeEventListener("loading-start", start);
      window.removeEventListener("loading-end", stop);
      if (interval) clearInterval(interval);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[9999] pointer-events-none">
      <div 
        className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-400 transition-all duration-300 ease-out"
        style={{ width: `${progress}%`, boxShadow: '0 0 10px rgba(79, 70, 229, 0.5)' }}
      />
    </div>
  );
}

// Helper functions to trigger the bar
export const startLoading = () => window.dispatchEvent(new CustomEvent("loading-start"));
export const stopLoading = () => window.dispatchEvent(new CustomEvent("loading-end"));
