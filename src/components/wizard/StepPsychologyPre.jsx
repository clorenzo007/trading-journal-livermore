const PRESETS = [
  "Calm",
  "Confident",
  "Anxious",
  "FOMO",
  "Overconfident",
  "Tired",
  "Distracted",
  "Focused",
];

export default function StepPsychologyPre({ data = {}, onChange = () => {} }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Psychology (Before Trade)</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-zinc-400 mb-1">
            Emotional state (pre)
          </label>
          <input
            list="emotional-presets"
            value={data.emotional_state_pre || ""}
            onChange={(e) => onChange("emotional_state_pre", e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-xs"
          />
          <datalist id="emotional-presets">
            {PRESETS.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Reason for entry</label>
          <input
            value={data.reason_for_entry || ""}
            onChange={(e) => onChange("reason_for_entry", e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-xs"
          />
        </div>
      </div>
    </div>
  );
}
