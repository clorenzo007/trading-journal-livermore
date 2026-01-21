export default function StepPsychologyPre({ trade, setTrade, onNext, onBack }) {
  const presets = [
    "Calm",
    "Focused",
    "Anxious",
    "Overconfident",
    "Fearful",
    "Tired",
    "Revenge mode",
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Psychology (Before)</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400">Emotional state</label>
          <input
            list="emotions-pre"
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2"
            value={trade.emotional_state_pre || ""}
            onChange={(e) => setTrade({ emotional_state_pre: e.target.value })}
            placeholder="Select or type..."
          />
          <datalist id="emotions-pre">
            {presets.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="block text-sm text-zinc-400">
            Reason for entry
          </label>
          <textarea
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2"
            rows={4}
            value={trade.reason_for_entry || ""}
            onChange={(e) => setTrade({ reason_for_entry: e.target.value })}
            placeholder="Why did you take this trade?"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700"
        >
          Back
        </button>

        <button
          onClick={onNext}
          className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500"
        >
          Next
        </button>
      </div>
    </div>
  );
}
