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

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-trade" element={<TradeWizard />} />
          <Route path="/edit/:id" element={<TradeWizard />} />
          <Route path="/entries" element={<Entries />} />
          <Route path="/concepts" element={<Concepts />} />
          <Route path="/review/:id" element={<Review />} />
          <Route path="/import" element={<ImportTrades />} /> {/* ← ESTA */}
        </Route>
      </Route>

      <Route
        path="*"
        element={<div style={{ padding: 50 }}>404 NOT FOUND</div>}
      />
    </Routes>
  );
}
