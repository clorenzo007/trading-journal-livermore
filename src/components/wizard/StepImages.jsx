import EntryImageUploader from "../EntryImageUploader";
import ReviewImageUploader from "../ReviewImageUploader";
import WizardCard from "./WizardCard";
import FullscreenViewer from "../FullscreenViewer";
import { useState } from "react";

export default function StepImages({ trade, setTrade, onNext, onBack }) {
  const [view, setView] = useState(null);

  return (
    <WizardCard title="Trade images">
      <div className="space-y-6">
        {/* ENTRY IMAGE */}
        <div>
          <div className="text-sm text-zinc-400 mb-2">Entry image</div>

          {trade.entryImage?.url ? (
            <img
              src={trade.entryImage.url}
              onClick={() => setView(trade.entryImage.url)}
              className="h-40 w-full object-cover rounded-xl border border-zinc-800 cursor-zoom-in"
            />
          ) : (
            <div className="text-xs text-zinc-500 mb-2">
              No entry image uploaded
            </div>
          )}

          <EntryImageUploader trade={trade} setTrade={setTrade} />
        </div>

        {/* REVIEW IMAGE */}
        <div>
          <div className="text-sm text-zinc-400 mb-2">Review image</div>

          {trade.reviewImage?.url ? (
            <img
              src={trade.reviewImage.url}
              onClick={() => setView(trade.reviewImage.url)}
              className="h-40 w-full object-cover rounded-xl border border-zinc-800 cursor-zoom-in"
            />
          ) : (
            <div className="text-xs text-zinc-500 mb-2">
              No review image uploaded
            </div>
          )}

          <ReviewImageUploader trade={trade} setTrade={setTrade} />
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
          className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500"
        >
          Next
        </button>
      </div>

      {view && <FullscreenViewer src={view} onClose={() => setView(null)} />}
    </WizardCard>
  );
}
