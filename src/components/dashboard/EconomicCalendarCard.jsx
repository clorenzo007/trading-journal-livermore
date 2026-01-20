import { useState } from "react";

export default function EconomicCalendarCard() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-zinc-400">
          Economic calendar (Today + Tomorrow)
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-indigo-400 hover:underline"
        >
          {expanded ? "Hide" : "Show"}
        </button>
      </div>

      {expanded && (
        <div className="relative w-full h-[420px] overflow-hidden rounded-lg">
          {/* Mask para tapar basura visual */}
          <div className="pointer-events-none absolute inset-0 z-10">
            {/* Top mask */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-zinc-900" />
            {/* Left mask */}
            <div className="absolute top-0 bottom-0 left-0 w-4 bg-zinc-900" />
            {/* Right mask */}
            <div className="absolute top-0 bottom-0 right-0 w-4 bg-zinc-900" />
            {/* Bottom mask */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-zinc-900" />
          </div>

          <iframe
            src="https://www.investing.com/economic-calendar/"
            title="Economic Calendar"
            className="absolute inset-0 w-full h-full origin-top-left scale-[1.1]"
            style={{
              filter:
                "invert(1) hue-rotate(180deg) brightness(0.92) contrast(1.1)",
              border: "none",
            }}
          />
        </div>
      )}
    </div>
  );
}
