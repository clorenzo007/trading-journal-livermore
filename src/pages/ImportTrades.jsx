import { useEffect, useState } from "react";
import { useAccount } from "../context/AccountContext";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Import Trades Page.
 * Provides functionality to import trades from MT5 Excel/CSV exports.
 * 
 * Features:
 * - Select target account.
 * - Upload file.
 * - Shows progress bar and result summary (imported vs skipped).
 */
export default function ImportTrades() {
  const {
    accounts,
    activeAccount,
    changeAccount,
    loading: accountLoading,
  } = useAccount();

  const [file, setFile] = useState(null);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (activeAccount) {
      setSelectedAccountId(activeAccount._id);
    }
  }, [activeAccount]);

  const upload = () => {
    if (!file || !selectedAccountId) {
      alert("Seleccioná un archivo y una cuenta");
      return;
    }

    const form = new FormData();
    form.append("file", file);

    setLoading(true);
    setProgress(5);
    setResult(null);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_URL}/import/mt5`);

    // Start Global Loading Bar
    window.dispatchEvent(new CustomEvent("loading-start"));

    xhr.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`,
    );

    // Override de cuenta
    xhr.setRequestHeader("x-account-id", selectedAccountId);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const p = Math.round((e.loaded / e.total) * 60);
        setProgress(p);
      }
    };

    xhr.onload = () => {
      // Stop Global Loading Bar
      window.dispatchEvent(new CustomEvent("loading-end"));
      setProgress(100);
      try {
        const data = JSON.parse(xhr.responseText);
        setResult(data);
      } catch {
        console.error("Respuesta no JSON:", xhr.responseText);
        alert("Error en la respuesta del servidor");
      } finally {
        setLoading(false);
      }
    };

    xhr.onerror = () => {
      // Stop Global Loading Bar
      window.dispatchEvent(new CustomEvent("loading-end"));
      alert("Import failed");
      setLoading(false);
    };

    xhr.send(form);
  };

  if (accountLoading) {
    return <div className="p-6 text-zinc-400">Cargando cuentas…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Import MT5 Trades</h1>

      {/* Cuenta destino */}
      <div className="space-y-2">
        <div className="text-sm text-zinc-400">Cuenta destino</div>
        <select
          value={selectedAccountId || ""}
          onChange={(e) => {
            setSelectedAccountId(e.target.value);
            changeAccount(e.target.value); // opcional: hace activa esa cuenta
          }}
          className="bg-zinc-800 px-3 py-2 rounded border border-zinc-700 w-full"
        >
          <option value="">— Seleccionar cuenta —</option>
          {accounts
            .filter((a) => a.status === "active")
            .map((a) => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
        </select>
      </div>

      {/* Archivo */}
      <input
        type="file"
        accept=".xlsx,.csv"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={upload}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 rounded"
      >
        {loading ? "Importing..." : "Import trades"}
      </button>

      {loading && (
        <div className="w-full bg-zinc-800 rounded h-3">
          <div
            className="bg-indigo-500 h-3 rounded transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {result && (
        <div className="bg-zinc-900 border border-zinc-800 rounded p-4 space-y-2">
          <div>
            Cuenta:{" "}
            <span className="text-zinc-200 font-medium">
              {result.account?.name || "—"}
            </span>
          </div>
          <div>Imported: {result.imported}</div>
          <div>Skipped (duplicates): {result.skipped}</div>
          {result.errors?.length > 0 && (
            <div className="text-red-400">Errors: {result.errors.length}</div>
          )}
        </div>
      )}
    </div>
  );
}
