import { useEffect, useMemo, useState } from "react";
import { getTrades } from "../api/trades";
import { useAccount } from "../context/AccountContext";

import LocalTimeCard from "../components/dashboard/LocalTimeCard";
import MarketTimesCard from "../components/dashboard/MarketTimesCard";
import EconomicCalendarCard from "../components/dashboard/EconomicCalendarCard";

import WinLossBar from "../components/dashboard/WinLossBar";
import WinLossPie from "../components/dashboard/WinLossPie";
import EquityCurve from "../components/dashboard/EquityCurve";
import SessionFilter from "../components/dashboard/SessionFilter";
import TradesTable from "../components/dashboard/TradesTable";
import Calendar from "../components/dashboard/Calendar";
import Heatmap from "../components/dashboard/Heatmap";
import DayDrawer from "../components/dashboard/DayDrawer";

import { withSession } from "../utils/sessions";

export default function Dashboard() {
  const { activeAccount, loading: accountLoading } = useAccount();

  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState("All");
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    if (!activeAccount || accountLoading) return;

    async function load() {
      setLoading(true);
      try {
        const data = await getTrades();
        setTrades(withSession(data));
      } catch (e) {
        console.error("Error loading trades", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [activeAccount, accountLoading]);

  const filtered = useMemo(() => {
    if (session === "All") return trades;
    return trades.filter((t) => t._session === session);
  }, [trades, session]);

  const dayFiltered = useMemo(() => {
    if (!selectedDay) return filtered;

    return filtered.filter((t) => {
      const d = new Date(t.entry_date).toISOString().slice(0, 10);
      return d === selectedDay;
    });
  }, [filtered, selectedDay]);

  if (loading || accountLoading) {
    return <div className="p-6 text-zinc-400">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LocalTimeCard />
        <MarketTimesCard />
        <EconomicCalendarCard />
      </div>

      {/* Session filter */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="text-sm text-zinc-400 mb-2">Filter by session</div>
        <SessionFilter value={session} onChange={setSession} />
      </div>

      {/* Charts */}
      <WinLossBar trades={filtered} />
      <WinLossPie trades={filtered} />
      <EquityCurve trades={filtered} />

      {/* Calendar + Heatmap */}
      <Calendar trades={filtered} onSelectDay={setSelectedDay} />
      <Heatmap trades={filtered} />

      {/* Selected day */}
      {selectedDay && (
        <div className="text-sm text-zinc-400">
          Showing trades for: <b>{selectedDay}</b>
          <button
            onClick={() => setSelectedDay(null)}
            className="ml-2 text-indigo-400 underline"
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <TradesTable trades={dayFiltered} />

      {/* Drawer */}
      {selectedDay && (
        <DayDrawer
          day={selectedDay}
          trades={dayFiltered}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}
