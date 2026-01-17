import { useEffect, useState } from "react";

export default function LocalTimeCard() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="text-sm text-zinc-400">Local time</div>
      <div className="text-xl font-semibold">{now.toLocaleTimeString()}</div>
      <div className="text-sm text-zinc-500">{now.toLocaleDateString()}</div>
    </div>
  );
}
