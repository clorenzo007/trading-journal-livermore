import { useEffect, useMemo, useState } from "react";
import { getTrades } from "../api/trades";

import LocalTimeCard from "../components/dashboard/LocalTimeCard";
import MarketTimesCard from "../components/dashboard/MarketTimesCard";
import WinLossBar from "../components/dashboard/WinLossBar";
import WinLossPie from "../components/dashboard/WinLossPie";
import EquityCurve from "../components/dashboard/EquityCurve";
import SessionFilter from "../components/dashboard/SessionFilter";
import TradesTable from "../components/dashboard/TradesTable";

import { withSession } from "../utils/sessions";

export default function Dashboard() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState("All");

  useEffect(() => {
    console.log("Dashboard mounted");

    async function load() {
      console.log("Calling getTrades...");
      try {
        const data = await getTrades();
        console.log("TRADES RAW:", data);
        setTrades(withSession(data.trades));
      } catch (e) {
        console.error("Error loading trades", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filtered = useMemo(() => {
    if (session === "All") return trades;
    return trades.filter((t) => t._session === session);
  }, [trades, session]);

  if (loading) {
    return <div className="p-6 text-zinc-400">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LocalTimeCard />
        <MarketTimesCard />
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

      {/* TABLE */}
      <TradesTable trades={filtered} />
    </div>
  );
}
