import { useMemo, useState } from "react";
import TradeDetailModal from "./TradeDetailModal";

function formatDateHuman(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getOutcome(trade) {
  const p = Number(trade.profit_loss);
  if (isNaN(p)) return null;
  if (p > 0) return "Win";
  if (p < 0) return "Loss";
  return "BE";
}

export default function DayDrawer({
  day,
  trades,
  onClose,
  onPrevDay,
  onNextDay,
}) {
  const [selectedTrade, setSelectedTrade] = useState(null);

  const summary = useMemo(() => {
    let total = 0;
    const counts = { Win: 0, Loss: 0, BE: 0 };

    trades.forEach((t) => {
      const p = Number(t.profit_loss || 0);
      total += p;

      const o = getOutcome(t);
      if (o) counts[o]++;
    });

    return { total, counts };
  }, [trades]);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-[560px] bg-zinc-950 border-l border-zinc-800 z-50 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-xs text-zinc-400">Trades for</div>
            <div className="text-lg font-semibold">{formatDateHuman(day)}</div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700"
          >
            Close
          </button>
        </div>

        {/* Summary */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 mb-4">
          <div className="text-sm text-zinc-400 mb-1">Daily summary</div>
          <div className="flex justify-between">
            <div>
              <div className="text-xs text-zinc-400">Total P/L</div>
              <div
                className={
                  summary.total >= 0 ? "text-emerald-400" : "text-rose-400"
                }
              >
                {summary.total.toFixed(2)}
              </div>
            </div>

            <div className="flex gap-4">
              <div>
                <div className="text-xs text-zinc-400">Wins</div>
                <div>{summary.counts.Win}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">Losses</div>
                <div>{summary.counts.Loss}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">BE</div>
                <div>{summary.counts.BE}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trades list */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {trades.length === 0 && (
            <div className="text-zinc-500 text-sm">No trades this day.</div>
          )}

          {trades.map((t) => (
            <div
              key={t._id}
              onClick={() => setSelectedTrade(t)}
              className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800/50 cursor-pointer"
            >
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{t.symbol}</div>
                  <div className="text-xs text-zinc-400">
                    {t.strategy_type} · {t.pattern}
                  </div>
                </div>

                <div
                  className={
                    Number(t.profit_loss) >= 0
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }
                >
                  {t.profit_loss}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-4">
          <button
            onClick={onPrevDay}
            className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700"
          >
            ← Previous
          </button>
          <button
            onClick={onNextDay}
            className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700"
          >
            Next →
          </button>
        </div>
      </div>

      {selectedTrade && (
        <TradeDetailModal
          trade={selectedTrade}
          onClose={() => setSelectedTrade(null)}
        />
      )}
    </>
  );
}
