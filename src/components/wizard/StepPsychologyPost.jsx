const PRESETS = [
  "Satisfied",
  "Frustrated",
  "Relieved",
  "Regretful",
  "Confident",
  "Disappointed",
  "Neutral",
  "Proud",
];

export default function StepPsychologyPost({ data = {}, onChange = () => {} }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Psychology (After Trade)</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Emotional state post */}
        <div>
          <label className="block text-zinc-400 mb-1">
            Emotional state (post)
          </label>
          <input
            list="emotional-post-presets"
            value={data.emotional_state_post || ""}
            onChange={(e) => onChange("emotional_state_post", e.target.value)}
            placeholder="Select or type..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
          />
          <datalist id="emotional-post-presets">
            {PRESETS.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </div>

        {/* Reason for exit */}
        <div>
          <label className="block text-zinc-400 mb-1">Reason for exit</label>
          <input
            list="reason-exit-presets"
            value={data.reason_for_exit || ""}
            onChange={(e) => onChange("reason_for_exit", e.target.value)}
            placeholder="Select or type..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
          />
          <datalist id="reason-exit-presets">
            <option value="Target hit" />
            <option value="Stop loss" />
            <option value="Manual exit" />
            <option value="Invalidation" />
            <option value="Time-based exit" />
            <option value="News risk" />
            <option value="Setup failure" />
          </datalist>
        </div>

        {/* Review notes */}
        <div className="md:col-span-2">
          <label className="block text-zinc-400 mb-1">Review notes</label>
          <textarea
            rows={4}
            value={data.review_notes || ""}
            onChange={(e) => onChange("review_notes", e.target.value)}
            placeholder="What did you learn? What would you change?"
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
