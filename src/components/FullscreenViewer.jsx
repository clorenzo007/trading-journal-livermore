import { useEffect, useState } from "react";

export default function FullscreenViewer({ src, onClose }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onWheel = (e) => {
    e.preventDefault();
    setScale((s) =>
      Math.min(4, Math.max(0.5, s + (e.deltaY < 0 ? 0.1 : -0.1)))
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center"
      onClick={onClose}
    >
      <img
        src={src}
        onWheel={onWheel}
        style={{ transform: `scale(${scale})` }}
        className="max-w-[90%] max-h-[90%] transition-transform cursor-zoom-out"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
