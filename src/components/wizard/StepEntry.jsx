import { useEffect } from "react";
import WizardCard from "./WizardCard";

export default function StepEntry({
  trade,
  setTrade,
  onNext,
  onBack,
  onCancel,
}) {
  // 🔥 Default: fecha y hora actual (solo si está vacío)
  useEffect(() => {
    if (!trade.entry_date) {
      setTrade({
        entry_date: new Date().toISOString().slice(0, 16),
      });
    }
  }, [trade.entry_date, setTrade]);

  const isValid =
    trade.entry_date &&
    trade.entry_price !== "" &&
    trade.entry_price !== null &&
    trade.position_size !== "" &&
    trade.position_size !== null;

  return (
    <WizardCard title="Entry" onCancel={onCancel}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Entry date</label>
          <input
            type="datetime-local"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.entry_date || ""}
            onChange={(e) => setTrade({ entry_date: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Entry price
          </label>
          <input
            type="number"
            step="any"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.entry_price || ""}
            onChange={(e) => setTrade({ entry_price: e.target.value })}
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Position size
          </label>
          <input
            type="number"
            step="any"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.position_size || ""}
            onChange={(e) => setTrade({ position_size: e.target.value })}
            placeholder="0.01"
          />
        </div>

        {!isValid && (
          <div className="text-sm text-red-400">
            Entry date, price and position size are required.
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
