import { useState, useMemo } from "react";

export default function EconomicCalendarCard() {
  const [open, setOpen] = useState(true);

  const today = useMemo(() => {
    const d = new Date();
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  }, []);

  const url = useMemo(() => {
    const base =
      "https://sslecal2.investing.com/?defaultFont=%23000000&showHeader=true&showFooter=false";
    const params = [
      "columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous",
      "importance=3",
      "features=timezone",
      `dateFrom=${today}`,
      `dateTo=${today}`,
    ].join("&");

    return `${base}&${params}`;
  }, [today]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs uppercase tracking-widest text-zinc-400">
          Today’s Economic Events
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700"
        >
          {open ? "Hide" : "Show"}
        </button>
      </div>

      {open && (
        <div className="flex-1 overflow-hidden rounded-lg border border-zinc-800 bg-white">
          <iframe
            src={url}
            width="100%"
            height="100%"
            frameBorder="0"
            className="w-full h-full"
            style={{
              zoom: 1.2,
            }}
            title="Economic Calendar"
          />
        </div>
      )}
    </div>
  );
}
