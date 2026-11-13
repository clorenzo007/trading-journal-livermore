import { useState } from "react";
import { CheckCircle2, Circle, Quote } from "lucide-react";
import { evaluateRules } from "../../utils/livermore";
import mikiLogo from "../../assets/mikiLogo";

/**
 * Livermore Rules Panel (Sidebar/Dropdown).
 * Checklist que se va poniendo verde a medida que se completan los campos del trade,
 * tanto los numéricos ($) como los emocionales.
 *
 * @param {object}  form       Trade (o formulario en curso) a evaluar.
 * @param {boolean} isSidebar  Versión compacta.
 * @param {string}  subtitle   Texto opcional bajo el título (ej. qué trade se está mostrando).
 */
export default function LivermorePanel({ form, isSidebar = false, subtitle }) {
  const [open, setOpen] = useState(false);

  const rules = evaluateRules(form || {});
  const pre = rules.filter((r) => r.group === "pre");
  const post = rules.filter((r) => r.group === "post");
  const done = rules.filter((r) => r.ok).length;
  const pct = Math.round((done / rules.length) * 100);
  const complete = done === rules.length;

  const iconSize = isSidebar ? "w-5 h-5" : "w-7 h-7";

  const renderList = (list) => (
    <ul className={`grid gap-x-12 gap-y-2 ${isSidebar ? "grid-cols-1 text-sm" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-xl"}`}>
      {list.map((r) => (
        <li
          key={r.label}
          className={`flex items-center gap-4 py-2 px-3 rounded-2xl transition-all duration-300 ${
            r.ok
              ? "text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.05)]"
              : "text-zinc-600 grayscale hover:grayscale-0 hover:bg-zinc-800/30"
          }`}
        >
          <div className={`transition-transform duration-300 ${r.ok ? "scale-110" : ""}`}>
            {r.ok ? (
              <CheckCircle2 className={`${iconSize} stroke-[2.5]`} />
            ) : (
              <Circle className={`${iconSize} stroke-[1.5] opacity-30`} />
            )}
          </div>
          <span className="font-bold tracking-tight">{r.label}</span>
        </li>
      ))}
    </ul>
  );

  const sectionTitle = (text, list) => (
    <div className="flex items-center justify-between mt-4 mb-2 px-1">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{text}</span>
      <span className="text-[10px] font-bold text-zinc-500">
        {list.filter((r) => r.ok).length}/{list.length}
      </span>
    </div>
  );

  return (
    <div className={`w-full bg-gradient-to-b from-zinc-900 to-black rounded-3xl border border-zinc-800/50 shadow-2xl relative overflow-hidden group ${isSidebar ? "p-6" : "p-8"}`}>
      {/* Decorative Background Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-600/5 blur-[100px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/50 pb-6 relative z-10 ${isSidebar ? "mb-4" : "mb-8"}`}>
        <div className="space-y-3 flex flex-col items-center md:items-start w-full">
          <h2 className="m-0 w-full flex justify-center">
            <img
              src={mikiLogo}
              alt="MIKI Trading — Reglas Livermore"
              className={`${isSidebar ? "w-28" : "w-36"} h-auto rounded-2xl shadow-lg`}
            />
          </h2>
          <p className="text-zinc-500 text-xs font-medium text-center w-full">{subtitle || "Protocolo de Operación Disciplinada"}</p>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-full text-sm text-zinc-300 transition-all font-bold"
        >
          {open ? "Cerrar" : "Ver Reglas"} {open ? "▲" : "▼"}
        </button>
      </div>

      {/* Progreso (siempre visible, también en mobile) */}
      <div className="relative z-10 mb-2">
        <div className="flex items-center justify-between text-xs font-bold mb-1">
          <span className={complete ? "text-emerald-400" : "text-zinc-400"}>
            {complete ? "Trade completo" : "Completitud del trade"}
          </span>
          <span className={complete ? "text-emerald-400" : "text-zinc-400"}>
            {done}/{rules.length} · {pct}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${complete ? "bg-emerald-500" : "bg-indigo-500"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className={`${open ? "block" : "hidden"} lg:block relative z-10`}>
        {sectionTitle("Antes de entrar", pre)}
        {renderList(pre)}
        {sectionTitle("Cierre y revisión", post)}
        {renderList(post)}

        {/* Premium Quote Section */}
        <div className={`relative pt-10 border-t border-zinc-800/50 ${isSidebar ? "mt-6" : "mt-8"}`}>
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 p-2 rounded-full text-indigo-500 shadow-xl">
            <Quote size={isSidebar ? 14 : 20} fill="currentColor" className="opacity-80" />
          </div>

          <div className="max-w-4xl mx-auto text-center space-y-4">
            <p className={`${isSidebar ? "text-lg" : "text-3xl"} text-zinc-100 font-extrabold italic leading-tight tracking-tight px-4 flex flex-col items-center`}>
              <span className={`text-indigo-400 opacity-50 mb-4 h-1 ${isSidebar ? "w-10" : "w-20"} bg-gradient-to-r from-transparent via-indigo-500 to-transparent`} />
              “Mejor pocas operaciones precisas que muchas no tanto...”
            </p>
            <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em] pt-4">— Jesse Livermore —</p>
          </div>
        </div>
      </div>
    </div>
  );
}
