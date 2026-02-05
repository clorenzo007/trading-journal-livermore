import { useEffect } from "react";
import WizardCard from "./WizardCard";

// 👉 Fecha y hora LOCAL compatible con datetime-local
function nowLocalDatetime() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export default function StepExit({
  trade,
  setTrade,
  onNext,
  onBack,
  onCancel,
}) {
  const exitPrice = Number(trade.exit_price);
  const profit = trade.profit_loss !== "" ? Number(trade.profit_loss) : null;

  // 🔥 Default exit date on mount if empty
  useEffect(() => {
    if (!trade.exit_date) {
      setTrade({ exit_date: nowLocalDatetime() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const errors = [];

  if (exitPrice && !trade.exit_date) {
    errors.push("Exit date is required when exit price is set.");
  }

  if (exitPrice && !trade.outcome) {
    errors.push("Outcome is required for a closed trade.");
  }

  if (profit !== null && isNaN(profit)) {
    errors.push("Profit / Loss must be a valid number.");
  }

  const isValid = errors.length === 0;

  return (
    <WizardCard title="Exit" onCancel={onCancel}>
      <div className="space-y-4">
        {/* EXIT DATE */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Exit date</label>
          <input
            type="datetime-local"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.exit_date || ""}
            onChange={(e) => setTrade({ exit_date: e.target.value })}
          />
        </div>

        {/* EXIT PRICE */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Exit price</label>
          <input
            type="number"
            step="any"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.exit_price ?? ""}
            onChange={(e) => setTrade({ exit_price: e.target.value })}
            placeholder="0.00"
          />
        </div>

        {/* PROFIT / LOSS */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Profit / Loss
          </label>
          <input
            type="number"
            step="any"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.profit_loss ?? ""}
            onChange={(e) => setTrade({ profit_loss: e.target.value })}
            placeholder="Positive or negative value"
          />
        </div>

        {/* OUTCOME */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Outcome</label>
          <select
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.outcome || ""}
            onChange={(e) => setTrade({ outcome: e.target.value })}
          >
            <option value="">—</option>
            <option value="Win">Win</option>
            <option value="Loss">Loss</option>
            <option value="Break-even">Break-even</option>
          </select>
        </div>

        {/* ERRORS */}
        {!isValid && (
          <div className="bg-red-900/20 border border-red-800 text-red-300 text-sm rounded p-3 space-y-1">
            {errors.map((e, i) => (
              <div key={i}>• {e}</div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700"
        >
          Back
        </button>

        <button
          onClick={onNext}
          disabled={!isValid}
          className={`px-5 py-2 rounded-lg font-medium transition ${
            isValid
              ? "bg-indigo-600 hover:bg-indigo-500"
              : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </WizardCard>
  );
}
