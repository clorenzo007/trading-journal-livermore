import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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

/**
 * Main Dashboard Page.
 * The central hub of the application, displaying high-level metrics, charts, and recent activity.
 * 
 * Features:
 * - Loads trades for the active account.
 * - Aggregates data for charts (Equity, Win/Loss, Heatmap).
 * - Provides global filtering by Session.
 * - Allows drilling down into specific days via the Calendar/Heatmap.
 * - Exports data to Excel.
 */
export default function Dashboard() {
  const navigate = useNavigate();
  const { activeAccount, loading: accountLoading } = useAccount();

  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState("All");
  const [selectedDay, setSelectedDay] = useState(null);

  // ==========================
  // LOAD TRADES
  // ==========================
  async function load() {
    if (!activeAccount?._id) return;
    
    setLoading(true);
    setTrades([]);
    setSelectedDay(null);

    try {
      const data = await getTrades(); 
      setTrades(withSession(Array.isArray(data) ? data : []));
    } catch (e) {
      console.error("Error loading trades", e);
      setTrades([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (accountLoading) return;

    if (!activeAccount?._id) {
      setTrades([]);
      setSelectedDay(null);
      setLoading(false);
      return;
    }

    load();
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
    <div className="container-fluid space-y-4">
      {/* 
        ===========================================================================
        SECTION: EXPORT BUTTON
        ===========================================================================
      */}
      <div className="row">
        <div className="col-12 d-flex justify-content-between mb-3">
          <button
            onClick={() => navigate("/new-trade")}
            className="btn btn-primary"
          >
            New Trade
          </button>
          <button
            onClick={handleExport}
            className="btn btn-success"
          >
            Export to Excel
          </button>
        </div>
      </div>

      {/* 
        ===========================================================================
        SECTION: KEY STATISTICS CARDS
        Row with 3 columns (stack on mobile, side-by-side on desktop)
        ===========================================================================
      */}
      <div className="row g-4 mb-4">
        {/* Local Time Card */}
        <div className="col-12 col-md-4">
          <LocalTimeCard />
        </div>
        {/* Market Sessions Card */}
        <div className="col-12 col-md-4">
          <MarketTimesCard />
        </div>
        {/* Economic Calendar Card */}
        <div className="col-12 col-md-4">
          <EconomicCalendarCard />
        </div>
      </div>

      {/* 
        ===========================================================================
        SECTION: LIVERMORE CHECKLIST
        Takes full width (col-12)
        ===========================================================================
      */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm">
            <h2 className="text-xl font-bold mb-3">Livermore Checklist</h2>
            <LivermorePanel form={filtered[0] || {}} />
          </div>
        </div>
      </div>

      {/* 
        ===========================================================================
        SECTION: SESSION FILTER
        Allows filtering trades by viewing session (NY, London, etc.)
        ===========================================================================
      */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 shadow-sm">
            <div className="text-xs text-zinc-400 mb-2 uppercase tracking-wider font-semibold">Filter by session</div>
            <SessionFilter value={session} onChange={setSession} />
          </div>
        </div>
      </div>

      {/* 
        ===========================================================================
        SECTION: CHARTS
        Visual representation of performance (Win/Loss, Equity Curve)
        ===========================================================================
      */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-6">
          <WinLossBar trades={filtered} />
        </div>
        <div className="col-12 col-lg-6">
          <WinLossPie trades={filtered} />
        </div>
        <div className="col-12">
          <EquityCurve trades={filtered} />
        </div>
      </div>

      {/* 
        ===========================================================================
        SECTION: CALENDAR & HEATMAP
        ===========================================================================
      */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-xl-8">
          <Calendar trades={filtered} onSelectDay={setSelectedDay} />
        </div>
        <div className="col-12 col-xl-4">
          <Heatmap trades={filtered} />
        </div>
      </div>

      {/* 
        ===========================================================================
        SECTION: FILTER INDICATOR
        Shows when a specific day is selected from the Calendar
        ===========================================================================
      */}
      {selectedDay && (
        <div className="row animate-in fade-in slide-in-from-top-2 duration-300 mb-4">
          <div className="col-12">
            <div className="alert bg-zinc-900 border-zinc-800 text-zinc-300 d-flex align-items-center justify-content-between">
              <span>Showing trades for: <strong className="text-white">{selectedDay}</strong></span>
              <button
                onClick={() => setSelectedDay(null)}
                className="btn btn-sm btn-link text-indigo-400 text-decoration-none"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 
        ===========================================================================
        SECTION: TRADES TABLE / LIST
        Responsive table component (Table on Desktop, Cards on Mobile)
        ===========================================================================
      */}
      <div className="row">
        <div className="col-12">
          <TradesTable trades={dayFiltered} onRefresh={load} />
        </div>
      </div>

      {/* 
        ===========================================================================
        DRAWER: DAY DETAIL
        Slide-out drawer when a day is selected
        ===========================================================================
      */}
      {selectedDay && (
        <DayDrawer
          day={selectedDay}
          trades={dayFiltered}
          onClose={() => setSelectedDay(null)}
          onRefresh={load}
        />
      )}
    </div>
  );
}
