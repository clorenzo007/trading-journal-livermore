export default function StepEntry({ data, onChange }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Entry</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Entry date */}
        <div>
          <label className="block text-zinc-400 mb-1">Entry date</label>
          <input
            type="datetime-local"
            value={data.entry_date || ""}
            onChange={(e) => onChange("entry_date", e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
          />
        </div>

        {/* Entry price */}
        <div>
          <label className="block text-zinc-400 mb-1">Entry price</label>
          <input
            type="number"
            step="0.0001"
            value={data.entry_price || ""}
            onChange={(e) => onChange("entry_price", e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
          />
        </div>

        {/* Position size (lots) */}
        <div>
          <label className="block text-zinc-400 mb-1">
            Position size (lots)
          </label>
          <input
            type="number"
            step="0.01"
            value={data.position_size || ""}
            onChange={(e) => onChange("position_size", e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
          />
          <div className="text-xs text-zinc-500 mt-1">
            Example: 0.10 = 1 mini lot, 1.00 = 1 standard lot
          </div>
        </div>
      </div>
    </div>
  );
}
