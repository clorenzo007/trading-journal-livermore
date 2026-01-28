import { useState } from "react";
import EconomicCalendarFullscreen from "./EconomicCalendarFullscreen";

export default function EconomicCalendarCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 cursor-pointer hover:border-indigo-500 transition"
      >
        <div className="text-sm text-zinc-400 mb-2">Economic Calendar</div>

        <iframe
          src="https://sslecal2.investing.com?columns=exc_flags,exc_currency,exc_importance&importance=1,2,3&features=datepicker&countries=25,32,5,72&calType=day&timeZone=12&lang=1"
          className="w-full h-40 rounded"
          title="Economic Calendar"
        />
      </div>

      {open && <EconomicCalendarFullscreen onClose={() => setOpen(false)} />}
    </>
  );
}
