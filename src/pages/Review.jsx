import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTradeById } from "../api/trades";
import FullscreenViewer from "../components/FullscreenViewer";

export default function TradeView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trade, setTrade] = useState(null);
  const [viewer, setViewer] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getTradeById(id);
      console.log("VIEW TRADE DATA:", data);
      setTrade(data);
    }
    load();
  }, [id]);

  if (!trade) return <div className="p-6 text-zinc-400">Loading trade...</div>;

  function Row({ label, value }) {
    return (
      <div className="flex justify-between border-b border-zinc-800 py-2 text-sm">
        <span className="text-zinc-400">{label}</span>
        <span className="font-medium">{value || "—"}</span>
      </div>
    );
  }

  function ImageBlock({ label, src }) {
    return (
      <div className="space-y-2">
        <div className="text-sm text-zinc-400">{label}</div>

        {src ? (
          <img
            src={src}
            alt={label}
            onClick={() => setViewer(src)}
            className="w-48 rounded border border-zinc-700 cursor-pointer hover:opacity-80"
          />
        ) : (
          <div className="text-zinc-500 text-sm">No image uploaded</div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-semibold">Trade Overview</h1>

      {/* INFO */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-1">
        <Row label="Symbol" value={trade.symbol} />
        <Row label="Strategy" value={trade.strategy_type} />
        <Row label="Pattern" value={trade.pattern} />
        <Row label="Entry date" value={trade.entry_date} />
        <Row label="Entry price" value={trade.entry_price} />
        <Row label="Position size" value={trade.position_size} />
        <Row label="Stop loss" value={trade.stop_loss} />
        <Row label="Risk %" value={trade.risk_percent} />
        <Row label="Exit date" value={trade.exit_date} />
        <Row label="Exit price" value={trade.exit_price} />
        <Row label="P/L" value={trade.profit_loss} />
        <Row label="Outcome" value={trade.outcome} />
        <Row label="Emotion (pre)" value={trade.emotional_state_pre} />
        <Row label="Reason entry" value={trade.reason_for_entry} />
        <Row label="Emotion (post)" value={trade.emotional_state_post} />
        <Row label="Reason exit" value={trade.reason_for_exit} />
        <Row label="Review notes" value={trade.review_notes} />
      </div>

      {/* IMAGES */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 grid grid-cols-2 gap-8">
        <ImageBlock label="Entry Image" src={trade.entryImage} />
        <ImageBlock label="Review Image" src={trade.reviewImage} />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between">
        <button
          onClick={() => navigate(-1)}
          className="bg-zinc-700 px-4 py-2 rounded"
        >
          Exit
        </button>

        <button
          onClick={() => navigate(`/edit/${trade._id}`)}
          className="bg-indigo-600 px-4 py-2 rounded"
        >
          Edit Trade
        </button>
      </div>

      {viewer && (
        <FullscreenViewer src={viewer} onClose={() => setViewer(null)} />
      )}
    </div>
  );
}
