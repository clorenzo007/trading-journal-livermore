export default function StepConfirm({ data, onReviewChange }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Confirm & Review</h2>

      {/* Summary */}
      <div className="bg-zinc-900 border border-zinc-800 rounded p-4 text-xs space-y-2">
        <div>
          <b>Symbol:</b> {data.symbol}
        </div>
        <div>
          <b>Strategy:</b> {data.strategy_type}
        </div>
        <div>
          <b>Pattern:</b> {data.pattern}
        </div>
        <div>
          <b>Entry:</b> {data.entry_price} @ {data.entry_date}
        </div>
        <div>
          <b>Exit:</b> {data.exit_price} @ {data.exit_date}
        </div>
        <div>
          <b>P/L %:</b>{" "}
          <span
            className={
              Number(data.profit_loss) >= 0
                ? "text-emerald-400"
                : "text-rose-400"
            }
          >
            {data.profit_loss}%
          </span>
        </div>
        <div>
          <b>Outcome:</b> {data.outcome}
        </div>
      </div>

      {/* Review system */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Score */}
        <div>
          <label className="block text-zinc-400 mb-1">Score (1–5)</label>
          <input
            type="number"
            min={1}
            max={5}
            value={data.review.score || ""}
            onChange={(e) => onReviewChange("score", e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
          />
        </div>

        {/* Followed plan */}
        <div>
          <label className="block text-zinc-400 mb-1">Followed the plan?</label>
          <select
            value={data.review.followedPlan ? "yes" : "no"}
            onChange={(e) =>
              onReviewChange("followedPlan", e.target.value === "yes")
            }
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        {/* Rule broken */}
        <div>
          <label className="block text-zinc-400 mb-1">Rule broken</label>
          <input
            type="text"
            value={data.review.ruleBroken || ""}
            onChange={(e) => onReviewChange("ruleBroken", e.target.value)}
            placeholder="If any..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
          />
        </div>

        {/* Lesson */}
        <div>
          <label className="block text-zinc-400 mb-1">Lesson learned</label>
          <input
            type="text"
            value={data.review.lesson || ""}
            onChange={(e) => onReviewChange("lesson", e.target.value)}
            placeholder="What did you learn?"
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
          />
        </div>

        {/* Would repeat */}
        <div>
          <label className="block text-zinc-400 mb-1">
            Would you repeat this setup?
          </label>
          <select
            value={data.review.wouldRepeat ? "yes" : "no"}
            onChange={(e) =>
              onReviewChange("wouldRepeat", e.target.value === "yes")
            }
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>
    </div>
  );
}
