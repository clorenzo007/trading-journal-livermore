import { useEffect, useState } from "react";
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

export default function Accounts() {
  const { accounts, setAccounts, activeAccount, changeAccount } = useAccount();
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

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
          prev.map((a) => (a._id === updated._id ? updated : a))
        );
      } else {
        const created = await createAccount(form);
        setAccounts((prev) => [...prev, created]);
        changeAccount(created._id); // hacerla activa
      }
      reset();
    } catch (e) {
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
        prev.map((a) => (a._id === updated._id ? updated : a))
      );
    } catch {
      alert("Error archivando cuenta");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Cuentas</h1>

      {/* Form */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
        <div className="text-sm text-zinc-400">
          {editingId ? "Editar cuenta" : "Nueva cuenta"}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nombre">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>

          <Field label="Proveedor">
            <input
              value={form.provider}
              onChange={(e) => setForm({ ...form, provider: e.target.value })}
            />
          </Field>

          <Field label="Tipo">
            <select
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

          <Field label="Número de cuenta">
            <input
              value={form.accountNumber}
              onChange={(e) =>
                setForm({ ...form, accountNumber: e.target.value })
              }
            />
          </Field>

          <Field label="Moneda">
            <input
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            />
          </Field>

          <Field label="Balance inicial">
            <input
              type="number"
              value={form.initialBalance}
              onChange={(e) =>
                setForm({ ...form, initialBalance: Number(e.target.value) })
              }
            />
          </Field>
        </div>

        <div className="flex gap-3 justify-end">
          {editingId && (
            <button onClick={reset} className="px-4 py-2 bg-zinc-700 rounded">
              Cancelar
            </button>
          )}
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 rounded"
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {accounts.map((a) =
