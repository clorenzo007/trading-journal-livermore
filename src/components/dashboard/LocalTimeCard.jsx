import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { formatNYSETime, formatNYSEDate } from "../../../utils/formatDate";

/**
 * Simple Digital Clock.
 * Displays current local time, updating every second.
 */
export default function LocalTimeCard() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/50 rounded-3xl p-6 flex flex-col justify-center items-center h-full relative overflow-hidden shadow-2xl group transition-all duration-500 hover:border-indigo-500/30">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
        <Clock size={80} className="text-indigo-500 rotate-12" />
      </div>

      <div className="flex items-center gap-2 mb-4 relative z-10">
        <Clock size={14} className="text-zinc-500" />
        <span className="text-xs font-black uppercase tracking-widest text-zinc-500">NYSE Time</span>
      </div>

      <div className="text-6xl font-black tracking-tighter text-white relative z-10 tabular-nums">
        {formatNYSETime(now, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        })}
      </div>

      <div className="text-sm font-bold text-indigo-400 mt-4 px-4 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20 relative z-10">
        {formatNYSEDate(now, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
}

