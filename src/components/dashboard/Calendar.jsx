import { useMemo, useState } from "react";
import DayTooltip from "./DayTooltip";

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days = [];
  const startWeekday = firstDay.getDay();

  for (let i = 0; i < startWeekday; i++) {
    days.push(null);
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  return days;
}

export default function Calendar({ trades, onSelectDay }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [hoveredDay, setHoveredDay] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  const days = useMemo(() => getMonthDays(year, month), [year, month]);

  const tradesByDay = useMemo(() => {
    const map = {};
    trades.forEach((t) => {
      if (!t.entry_date) return;
      const key = formatDate(new Date(t.entry_date));
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [trades]);

  const dayStats = useMemo(() => {
    const map = {};
    trades.forEach((t) => {
      if (!t.entry_date) return;
      const key = formatDate(new Date(t.entry_date));
      if (!map[key]) {
        map[key] = { total: 0, count: 0, wins: 0, losses: 0, be: 0 };
      }
      const p = Number(t.profit_loss || 0);
      map[key].total += p;
      map[key].count++;
      if (p > 0) map[key].wins++;
      else if (p < 0) map[key].losses++;
      else map[key].be++;
    });
    return map;
  }, [trades]);

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function getDayColor(dayTrades) {
    if (!dayTrades || dayTrades.length === 0) return "bg-zinc-900";
    const sum = dayTrades.reduce(
      (acc, t) => acc + Number(t.profit_loss || 0),
      0
    );
    if (sum > 0) return "bg-emerald-500/20 text-emerald-400";
    if (sum < 0) return "bg-rose-500/20 text-rose-400";
    return "bg-zinc-700 text-zinc-300";
  }

  retu
