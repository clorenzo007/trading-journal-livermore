import TradesTable from "./TradesTable";
import TradeCards from "./TradeCards";

/**
 * Trade List Container.
 * Responsive wrapper that switches between Table view (Desktop) and Card view (Mobile).
 */
export default function TradeList({ trades, onSelect, onEdit }) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        <TradeTable trades={trades} onSelect={onSelect} onEdit={onEdit} />
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <TradeCards trades={trades} onSelect={onSelect} onEdit={onEdit} />
      </div>
    </>
  );
}
