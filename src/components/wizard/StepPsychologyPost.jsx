export default function StepPsychologyPost({
  trade,
  setTrade,
  onNext,
  onBack,
}) {
  const presets = [
    "Satisfied",
    "Frustrated",
    "Neutral",
    "Angry",
    "Disappointed",
    "Confident",
    "Relieved",
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Psychology (After)</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400">Emotional state</label>
          <input
            list="emotions-post"
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2"
            value={trade.emotional_state_post || ""}
            onChange={(e) => setTrade({ emotional_state_post: e.target.value })}
            placeholder="Select or type..."
          />
          <datalist id="emotions-post">
            {presets.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="block text-sm text-zinc-400">Reason for exit</label>
          <textarea
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2"
            rows={4}
            value={trade.reason_for_exit || ""}
            onChange={(e) => setTrade({ reason_for_exit: e.target.value })}
            placeholder="Why did you exit this trade?"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400">Review notes</label>
          <textarea
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2"
            rows={3}
            value={trade.review_notes || ""}
            onChange={(e) => setTrade({ review_notes: e.target.value })}
            placeholder="General notes..."
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
