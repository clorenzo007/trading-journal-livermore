import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Entries from "./pages/Entries";
import Concepts from "./pages/Concepts";
import TradeWizard from "./components/wizard/TradeWizard";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedLayout from "./components/layout/ProtectedLayout";
import Review from "./pages/Review";
import ImportTrades from "./pages/ImportTrades";
import Accounts from "./pages/Accounts";
import Trades from "./pages/Trades";
import Setup from "./pages/Setup";
import Help from "./pages/Help";
import StatusBar from "./components/layout/StatusBar";
import { useLanguage } from "./context/LanguageContext";

/**
 * Application Entry Point.
 * Defines the main routing structure using React Router.
 * 
 * Routes:
 * - Public: Login, Register.
 * - Protected: Dashboard, Trades, Wizard, Concepts, Admin, etc.
 * - Catch-all: 404.
 */
export default function App() {
  const { t } = useLanguage();
  return (
    <>
    <Routes>
      {/* Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Raíz */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="trades" element={<Trades />} /> {/* LISTA */}
          <Route path="trades/:id" element={<Review />} /> {/* VISTA */}
          <Route path="new-trade" element={<TradeWizard />} />
          <Route path="edit/:id" element={<TradeWizard />} />
          <Route path="entries" element={<Entries />} />
          <Route path="concepts" element={<Concepts />} />
          <Route path="import" element={<ImportTrades />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="setup" element={<Setup />} />
          <Route path="help" element={<Help />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={<div style={{ padding: 40 }}>{t("404 NOT FOUND")}</div>}
      />
    </Routes>
    <StatusBar />
    </>
  );
}
