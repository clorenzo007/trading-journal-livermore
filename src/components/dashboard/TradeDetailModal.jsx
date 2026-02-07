import { useState } from "react";
import TradePreviewModal from "../trades/TradePreviewModal";
import TradeEditModal from "../trades/TradeEditModal";

export default function TradeDetailModal({ trade, onClose, onRefresh }) {
  const [mode, setMode] = useState("preview"); // "preview" | "edit"

  const handleSaved = (updated) => {
    if (onRefresh) onRefresh();
    if (!updated) {
      // Deleted
      onClose();
    } else {
      // Switche back or stay? Usually edit -> preview is nice
      setMode("preview");
    }
  };

  if (mode === "edit") {
    return (
      <TradeEditModal
        trade={trade}
        onClose={() => setMode("preview")}
        onSaved={handleSaved}
      />
    );
  }

  return (
    <TradePreviewModal
      trade={trade}
      onClose={onClose}
      onEdit={() => setMode("edit")}
    />
  );
}
