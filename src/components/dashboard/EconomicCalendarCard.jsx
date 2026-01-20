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
          <iframe
            src="https://www.investing.com/economic-calendar/"
            title="Economic Calendar"
            className="absolute inset-0 w-full h-full origin-top-left scale-[1.35]"
            style={{
              filter:
                "invert(1) hue-rotate(180deg) brightness(0.9) contrast(1.1)",
              border: "none",
            }}
          />
        </div>
      )}
    </div>
  );
}
