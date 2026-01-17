export default function KPIs({ trades }) {
  const total = trades.length;
  const wins = trades.filter((t) => t.outcome === "Win").length;
  const losses = trades.filter((t) => t.outcome === "Loss").length;

  const pnl = trades.reduce((sum, t) => sum + Number(t.profit_loss || 0), 0);

  const winrate = total > 0 ? ((wins / total) * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <Card label="Trades" value={total} />
      <Card label="Winrate" value={`${winrate}%`} />
      <Card label="PnL" value={pnl} />
      <Card label="Wins / Losses" value={`${wins} / ${losses}`} />
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="text-xs text-zinc-400">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
