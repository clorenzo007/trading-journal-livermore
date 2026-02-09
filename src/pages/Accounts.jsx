import { useState } from "react";
import { useAccount } from "../context/AccountContext";
import {
  createAccount,
  updateAccount,
  archiveAccount,
} from "../services/accounts";

const EMPTY = {
  name: "",
  provider: "",
  accountType: "real",
  accountNumber: "",
  currency: "USD",
  initialBalance: 0,
};

/**
 * Trading Accounts Management Page.
 * Allows users to create and manage multiple trading portfolios (Real, Demo, Funded).
 * 
 * Features:
 * - List active accounts.
 * - Create new accounts.
 * - Edit existing account details.
 * - Archive/Delete accounts.
 * - Switch the "Active" account context for the entire app.
 */
export default function Accounts() {
  const { accounts, setAccounts, activeAccount, changeAccount } = useAccount();
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all"); // all, active, archived

  const startEdit = (acc) => {
    setEditingId(acc._id);
    setForm({
      name: acc.name,
      provider: acc.provider,
      accountType: acc.accountType,
      accountNumber: acc.accountNumber,
      currency: acc.currency,
      initialBalance: acc.initialBalance || 0,
    });
  };

  const reset = () => {
    setEditingId(null);
    setForm(EMPTY);
  };

  const save = async () => {
    try {
      setSaving(true);
      if (editingId) {
        const updated = await updateAccount(editingId, form);
        setAccounts((prev) =>
          prev.map((a) => (a._id === updated._id ? updated : a)),
        );
      } else {
        const created = await createAccount(form);
        setAccounts((prev) => [...prev, created]);
        changeAccount(created._id); // hacerla activa
      }
      reset();
    } catch {
      alert("Error guardando cuenta");
    } finally {
      setSaving(false);
    }
  };

  const archive = async (id) => {
    if (!confirm("¿Archivar esta cuenta?")) return;
    try {
      const updated = await archiveAccount(id);
      setAccounts((prev) =>
        prev.map((a) => (a._id === updated._id ? updated : a)),
      );
    } catch {
      alert("Error archivando cuenta");
    }
  };

  return (
    <div className="container py-4">
      <h1 className="h3 fw-bold mb-4">Cuentas</h1>

      {/* Form */}
      <div className="card bg-zinc-900 border-zinc-800 rounded-3 p-4 mb-5 shadow-sm">
        <div className="text-secondary small mb-3 uppercase tracking-wider font-semibold">
          {editingId ? "Editar cuenta" : "Nueva cuenta"}
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <Field label="Nombre">
              <input
                className="form-control bg-zinc-800 border-zinc-700 text-white shadow-none"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>
          </div>

          <div className="col-12 col-md-6">
            <Field label="Proveedor">
              <input
                className="form-control bg-zinc-800 border-zinc-700 text-white shadow-none"
                value={form.provider}
                onChange={(e) => setForm({ ...form, provider: e.target.value })}
              />
            </Field>
          </div>

          <div className="col-12 col-md-4">
            <Field label="Tipo">
              <select
                className="form-select bg-zinc-800 border-zinc-700 text-white shadow-none"
                value={form.accountType}
                onChange={(e) =>
                  setForm({ ...form, accountType: e.target.value })
                }
              >
                <option value="real">Real</option>
                <option value="fondeo">Fondeo</option>
                <option value="demo">Demo</option>
              </select>
            </Field>
          </div>

          <div className="col-12 col-md-4">
            <Field label="Número de cuenta">
              <input
                className="form-control bg-zinc-800 border-zinc-700 text-white shadow-none"
                value={form.accountNumber}
                onChange={(e) =>
                  setForm({ ...form, accountNumber: e.target.value })
                }
              />
            </Field>
          </div>

          <div className="col-12 col-md-4">
            <Field label="Moneda">
              <input
                className="form-control bg-zinc-800 border-zinc-700 text-white shadow-none"
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
              />
            </Field>
          </div>

          <div className="col-12 col-md-4">
            <Field label="Balance inicial">
              <input
                type="number"
                className="form-control bg-zinc-800 border-zinc-700 text-white shadow-none"
                value={form.initialBalance}
                onChange={(e) =>
                  setForm({ ...form, initialBalance: Number(e.target.value) })
                }
              />
            </Field>
          </div>
        </div>

        <div className="d-flex gap-2 justify-content-end mt-4">
          {editingId && (
            <button onClick={reset} className="btn btn-secondary px-4">
              Cancelar
            </button>
          )}
          <button
            onClick={save}
            disabled={saving}
            className="btn btn-primary px-4 shadow-sm"
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>

      {/* List */}
      <h2 className="h5 fw-bold mb-3">Tus Cuentas</h2>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {["all", "active", "archived"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? "bg-zinc-800 text-white border border-zinc-700"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="row g-3">
        {accounts
          .filter((a) => {
            if (filter === "all") return a.status !== "archived"; // Show active/inactive by default
            if (filter === "active") return a.status === "active";
            if (filter === "archived") return a.status === "archived";
            return true;
          })
          .map((a) => (
          <div key={a._id} className="col-12 col-lg-6">
            <div
              className={`card h-100 bg-zinc-900 border-zinc-800 rounded-3 p-3 shadow-none transition-all ${activeAccount?._id === a._id ? 'border-primary border-opacity-50 ring-1 ring-primary ring-opacity-10' : ''}`}
            >
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="fw-bold d-flex align-items-center gap-2">
                    {a.name}
                    {activeAccount?._id === a._id && (
                      <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-20 fw-medium">Activa</span>
                    )}
                  </div>
                  <div className="small text-secondary mt-1">
                    {a.provider} · {a.accountType} · {a.currency}
                  </div>
                </div>

                <div className="d-flex gap-2">
                  {activeAccount?._id !== a._id && (
                    <button
                      onClick={() => changeAccount(a._id)}
                      className="btn btn-sm btn-outline-light border-zinc-800"
                    >
                      Activar
                    </button>
                  )}
                  <button
                    onClick={() => startEdit(a)}
                    className="btn btn-sm btn-outline-light border-zinc-800"
                  >
                    Editar
                  </button>
                  {a.status === "active" && (
                    <button
                      onClick={() => archive(a._id)}
                      className="btn btn-sm btn-outline-danger border-danger border-opacity-20"
                    >
                      Archivar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-2">
      <label className="form-label small text-secondary fw-semibold mb-1">{label}</label>
      {children}
    </div>
  );
}
