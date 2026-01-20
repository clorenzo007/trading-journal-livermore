import { useEffect, useState } from "react";

export default function LocalTimeCard() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col justify-center items-center h-full">
      <div className="text-sm text-zinc-400 mb-2">Local time</div>

      <div className="text-4xl font-bold tracking-tight">
        {now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </div>

      <div className="text-sm text-zinc-400 mt-2">
        {now.toLocaleDateString()}
      </div>
    </div>
  );
}
