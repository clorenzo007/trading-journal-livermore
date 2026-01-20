export default function DayTooltip({ day, stats }) {
  if (!day || !stats) return null;

  const { total, count, wins, losses, be } = stats;

  return (
    <div className="absolute z-50 p-2 rounded bg-zinc-900 border border-zinc-800 text-xs shadow-lg pointer-events-none">
      <div className="font-semibold mb-1">{day}</div>
      <div className="flex justify-between gap-4">
        <span>Total P/L</span>
        <span className={total >= 0 ? "text-emerald-400" : "text-rose-400"}>
          {total.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between gap-4">
        <span>Trades</span>
        <span>{count}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span>Wins</span>
        <span>{wins}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span>Losses</span>
        <span>{losses}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span>BE</span>
        <span>{be}</span>
      </div>
    </div>
  );
}
