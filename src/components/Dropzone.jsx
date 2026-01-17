import { useState } from "react";

export default function Dropzone({ onFile }) {
  const [over, setOver] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      }}
      className={`relative border-2 border-dashed rounded-lg p-6 text-center ${
        over ? "border-indigo-500 bg-indigo-500/10" : "border-zinc-700"
      }`}
    >
      {over && (
        <div className="absolute inset-0 bg-indigo-600/20 rounded-lg flex items-center justify-center text-white text-lg">
          Drop here
        </div>
      )}
      <div className="text-zinc-400">
        Drag & drop image here or use the button
      </div>
    </div>
  );
}
