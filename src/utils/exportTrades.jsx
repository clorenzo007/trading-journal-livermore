import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportTradesToExcel(trades) {
  if (!trades?.length) return;

  const rows = trades.map((t) => ({
    Symbol: t.symbol,
    Strategy: t.strategy_type,
    Pattern: t.pattern,

    "Entry Date": t.entry_date,
    "Entry Price": t.entry_price,
    "Position Size": t.position_size,

    "Stop Loss": t.stop_loss,
    "Risk %": t.risk_percent,

    "Exit Date": t.exit_date,
    "Exit Price": t.exit_price,
    "Profit/Loss": t.profit_loss,
    Outcome: t.outcome,

    "Emotion Pre": t.emotional_state_pre,
    "Reason Entry": t.reason_for_entry,
    "Emotion Post": t.emotional_state_post,
    "Reason Exit": t.reason_for_exit,
    "Review Notes": t.review_notes,

    Session: t._session || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Trades");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, "trading_journal.xlsx");
}
