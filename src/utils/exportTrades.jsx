import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { translate as t } from "../context/LanguageContext";

export function exportTradesToExcel(trades) {
  if (!trades?.length) return;

  const rows = trades.map((tr) => ({
    [t("Symbol")]: tr.symbol,
    [t("Strategy")]: tr.strategy_type,
    [t("Pattern")]: tr.pattern,

    [t("Entry date")]: tr.entry_date,
    [t("Entry price")]: tr.entry_price,
    [t("Position size")]: tr.position_size,

    [t("Stop loss")]: tr.stop_loss,
    [t("Risk %")]: tr.risk_percent,

    [t("Exit date")]: tr.exit_date,
    [t("Exit price")]: tr.exit_price,
    [t("Profit / Loss")]: tr.profit_loss,
    [t("Outcome")]: tr.outcome ? t(tr.outcome) : "",

    [t("Emotion (pre)")]: tr.emotional_state_pre,
    [t("Reason entry")]: tr.reason_for_entry,
    [t("Emotion (post)")]: tr.emotional_state_post,
    [t("Reason exit")]: tr.reason_for_exit,
    [t("Review notes")]: tr.review_notes,

    [t("Session")]: tr._session ? t(tr._session) : "",
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
