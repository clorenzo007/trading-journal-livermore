import { useState } from "react";

export default function EconomicCalendarCard() {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs uppercase tracking-widest text-zinc-400">
          Economic Calendar
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700"
        >
          {open ? "Hide" : "Show"}
        </button>
      </div>

      {open && (
        <div className="flex-1 overflow-hidden rounded-lg border border-zinc-800">
          <iframe
            src="https://sslecal2.investing.com/?ecoDayBackground=%2318181b&defaultFont=%23e5e7eb&showHeader=true&showFooter=false&columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&importance=3&features=datepicker,timezone"
            width="100%"
            height="100%"
            frameBorder="0"
            allowTransparency="true"
            className="w-full h-full"
            title="Economic Calendar"
          />
        </div>
      )}
    </div>
  );
}
