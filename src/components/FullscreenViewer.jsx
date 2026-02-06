import { useEffect, useRef, useState } from "react";

export default function FullscreenViewer({ src, onClose }) {
  const imgRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const onWheel = (e) => {
    e.preventDefault();
    setScale((s) => Math.min(5, Math.max(1, s + (e.deltaY < 0 ? 0.2 : -0.2))));
  };

  const onMouseDown = () => setDragging(true);
  const onMouseUp = () => setDragging(false);

  const onMouseMove = (e) => {
    if (!dragging) return;
    setPos((p) => ({ x: p.x + e.movementX, y: p.y + e.movementY }));
  };

  return (
    <div
      className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center overflow-hidden"
      onClick={onClose}
      onWheel={onWheel}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <img
        ref={imgRef}
        src={src}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={onMouseDown}
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
          cursor: dragging ? "grabbing" : "grab",
        }}
        className="max-w-[90vw] max-h-[90vh] select-none object-contain transition-transform"
        draggable={false}
      />
    </div>
  );
}
