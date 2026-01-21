export default function StepRisk({ data, onChange }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Risk</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stop loss */}
        <div>
          <label className="block text-zinc-400 mb-1">Stop loss</label>
          <input
            type="number"
            step="0.0001"
            value={data.stop_loss || ""}
            onChange={(e) => onChange("stop_loss", e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
          />
        </div>

        {/* Risk percent */}
        <div>
          <label className="block text-zinc-400 mb-1">Risk (%)</label>
          <input
            type="number"
            step="0.01"
            value={data.risk_percent || ""}
            onChange={(e) => onChange("risk_percent", e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
          />
          <div className="text-xs text-zinc-500 mt-1">
            Percentage of account risked on this trade
          </div>
        </div>
      </div>
    </div>
  );
}
