import { useState } from "react";
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
    activeAccount,
    loading: accountLoading,
  } = useAccount();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const upload = () => {
    if (!file) {
      alert("Por favor, seleccioná un archivo.");
      return;
    }
    if (!activeAccount) {
      alert("No hay ninguna cuenta activa seleccionada.");
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

    // Enviar cuenta activa
    xhr.setRequestHeader("x-account-id", activeAccount._id);

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
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-zinc-400 animate-pulse text-lg">Cargando cuenta activa...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Import Trades</h1>
        <p className="text-sm text-zinc-400 mt-2">
          Subí tu archivo Excel (.xlsx) o CSV para cargar tus operaciones directamente en tu cuenta de trading activa.
        </p>
      </div>

      {/* Cuenta Activa Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center justify-between shadow-lg backdrop-blur-md">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Cuenta Activa Destino</div>
          <div className="text-xl font-bold text-white">
            {activeAccount ? activeAccount.name : "Sin cuenta seleccionada"}
          </div>
          {activeAccount && (
            <div className="text-xs text-zinc-400">
              Balance: <span className="font-semibold text-indigo-400">${activeAccount.balance?.toLocaleString() || "0"}</span> {activeAccount.currency || "USD"}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-semibold">
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" />
          Activa
        </div>
      </div>

      {/* File Upload Zone */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-zinc-300">Archivo de operaciones</label>
        <div className="relative group border-2 border-dashed border-zinc-800 hover:border-indigo-500/50 rounded-xl p-8 text-center transition-all bg-zinc-950/30 hover:bg-zinc-950/50 cursor-pointer">
          <input
            type="file"
            accept=".xlsx,.csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-3">
            <div className="flex justify-center">
              <svg className="w-10 h-10 text-zinc-500 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="text-sm font-medium text-zinc-300">
              {file ? (
                <span className="text-indigo-400 font-semibold">{file.name}</span>
              ) : (
                <span>Arrastrá tu archivo o haz click para buscar</span>
              )}
            </div>
            <div className="text-xs text-zinc-500">Soporta formatos .xlsx y .csv</div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={upload}
          disabled={loading || !file || !activeAccount}
          className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-200 flex items-center justify-center gap-2 ${
            loading || !file || !activeAccount
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-800"
              : "bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-indigo-500/10 cursor-pointer"
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Importando...
            </>
          ) : (
            "Importar Operaciones"
          )}
        </button>
      </div>

      {/* Progress Bar */}
      {loading && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-zinc-400">
            <span>Cargando archivo...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Results Summary */}
      {result && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4 shadow-xl">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Resumen de Importación
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-zinc-950/40 p-3 rounded-lg border border-zinc-800/40">
              <div className="text-zinc-500 text-xs uppercase font-semibold">Importados</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">{result.imported}</div>
            </div>
            <div className="bg-zinc-950/40 p-3 rounded-lg border border-zinc-800/40">
              <div className="text-zinc-500 text-xs uppercase font-semibold">Duplicados omitidos</div>
              <div className="text-2xl font-black text-amber-500 mt-1">{result.skipped}</div>
            </div>
          </div>
          {result.errors?.length > 0 && (
            <div className="mt-3 bg-red-950/20 border border-red-900/40 rounded-lg p-3 space-y-1">
              <div className="text-red-400 font-bold text-xs uppercase tracking-wider">Errores detectados ({result.errors.length})</div>
              <ul className="text-xs text-red-300/80 list-disc pl-4 space-y-0.5 max-h-32 overflow-y-auto">
                {result.errors.slice(0, 10).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
                {result.errors.length > 10 && <li>Y {result.errors.length - 10} errores más...</li>}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
