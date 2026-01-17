import TradeTable from "./TradeTable";
import TradeCards from "./TradeCards";

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
