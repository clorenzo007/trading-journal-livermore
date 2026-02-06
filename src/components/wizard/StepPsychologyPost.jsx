import WizardCard from "./WizardCard";

export default function StepPsychologyPost({
  trade,
  setTrade,
  onNext,
  onBack,
  onCancel,
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
    <WizardCard title="Psychology (After)" onCancel={onCancel}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Emotional state
          </label>
          <input
            list="emotions-post"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.emotional_state_post || ""}
            onChange={(e) =>
              setTrade({ emotional_state_post: e.target.value })
            }
            placeholder="Select or type…"
          />
          <datalist id="emotions-post">
            {presets.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Reason for exit
          </label>
          <textarea
            rows={4}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.reason_for_exit || ""}
            onChange={(e) =>
              setTrade({ reason_for_exit: e.target.value })
            }
            placeholder="Why did you exit this trade?"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Review notes
          </label>
          <textarea
            rows={3}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2"
            value={trade.review_notes || ""}
            onChange={(e) =>
              setTrade({ review_notes: e.target.value })
            }
            placeholder="Any other thoughts?"
          />
        </div>
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
          className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-medium transition"
        >
          Next
        </button>
      </div>
    </WizardCard>
  );
}
