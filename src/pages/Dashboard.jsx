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
import LivermorePanel from "../components/wizard/LivermorePanel";
import { exportTradesToExcel } from "../utils/exportTrades";

export default function Dashboard() {
  const { activeAccount, loading: accountLoading } = useAccount();

  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState("All");
  const [selectedDay, setSelectedDay] = useState(null);

  // ==========================
  // LOAD TRADES
  // ==========================
  useEffect(() => {
    if (accountLoading) return;

    // 🔥 Sin cuenta activa real: no cargues trades, no quedes "loading"
    if (!activeAccount?._id) {
      setTrades([]);
      setSelectedDay(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setTrades([]);
      setSelectedDay(null);

      try {
        const data = await getTrades(); // backend decide active account
        if (cancelled) return;
        setTrades(withSession(Array.isArray(data) ? data : []));
      } catch (e) {
        console.error("Error loading trades", e);
        if (cancelled) return;
        setTrades([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [activeAccount?._id, accountLoading]);

  // ==========================
  // FILTERS
  // ==========================
  const filtered = useMemo(() => {
    if (session === "All") return trades;
    return trades.filter((t) => t._session === session);
  }, [trades, session]);

  const dayFiltered = useMemo(() => {
    if (!selectedDay) return filtered;

    return filtered.filter((t) => {
      if (!t.entry_date) return false;
      const d = new Date(t.entry_date).toISOString().slice(0, 10);
      return d === selectedDay;
    });
  }, [filtered, selectedDay]);

  // ==========================
  // STATES
  // ==========================
  if (accountLoading || loading) {
    return <div className="p-6 text-zinc-400">Loading dashboard…</div>;
  }

  // 🔥 Estado vacío: no hay cuenta activa real (en DB)
  if (!activeAccount?._id) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-2">
            No hay una cuenta activa
          </h2>
          <p className="text-sm text-zinc-400 mb-4">
            Activá una cuenta desde <b>Cuentas</b> para poder ver el dashboard y
            cargar trades.
          </p>
          <a
            href="/accounts"
            className="inline-block px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500"
          >
            Ir a Cuentas
          </a>
        </div>
      </div>
    );
  }

  const handleExport = () => {
    exportTradesToExcel(filtered);
  };

  // ==========================
  // RENDER
  // ==========================
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Export */}
      <div className="flex justify-end">
        <button
          onClick={handleExport}
          className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500"
        >
          Export to Excel
        </button>
      </div>

      {/* Top cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LocalTimeCard />
        <MarketTimesCard />
        <EconomicCalendarCard />
      </div>

      {/* Livermore */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">Livermore Checklist</h2>
        <LivermorePanel form={filtered[0] || {}} />
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
