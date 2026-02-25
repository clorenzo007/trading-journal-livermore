import { useState } from "react";
import { CheckCircle2, Circle, Quote } from "lucide-react";

/**
 * Livermore Rules Panel (Sidebar/Dropdown).
 * A checklist that validates if the user is following the trading plan "rules".
 * Updates essentially as the user fills out the form.
 */
export default function LivermorePanel({ form }) {
  const [open, setOpen] = useState(false);

  const rules = [
    { label: "Tengo un setup definido", ok: Boolean(form.pattern) },
    { label: "Tengo una estrategia clara", ok: Boolean(form.strategy_type) },
    { label: "Sé qué estoy operando", ok: Boolean(form.symbol) },
    { label: "Definí punto de entrada", ok: Boolean(form.entry_price) },
    { label: "Definí tamaño", ok: Boolean(form.position_size) },
    { label: "Definí stop", ok: Boolean(form.stop_loss) },
    { label: "Definí riesgo", ok: Boolean(form.risk_percent) },
    { label: "Escribí mi razón", ok: Boolean(form.reason_for_entry) },
    {
      label: "Reconozco mi estado emocional",
      ok: Boolean(form.emotional_state_pre),
    },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-zinc-900 to-black p-8 rounded-3xl border border-zinc-800/50 shadow-2xl overflow-hidden relative group">
      {/* Decorative Background Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-600/5 blur-[100px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-zinc-800/50 pb-6 relative z-10">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
            <span className="w-2 h-8 bg-indigo-500 rounded-full inline-block" />
            Reglas Livermore
          </h2>
          <p className="text-zinc-500 text-sm font-medium ml-5">Protocolo de Operación Disciplinada</p>
        </div>
        
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-full text-sm text-zinc-300 transition-all font-bold"
        >
          {open ? "Cerrar Dashboard" : "Ver Reglas"} {open ? "▲" : "▼"}
        </button>
      </div>

      <div className={`${open ? "block" : "hidden"} lg:block relative z-10`}>
        {/* Rules Grid */}
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6 text-xl mb-12">
          {rules.map((r, i) => (
            <li
              key={i}
              className={`flex items-center gap-4 group/item py-2 px-3 rounded-2xl transition-all duration-300 ${
                r.ok 
                  ? "text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.05)]" 
                  : "text-zinc-600 grayscale hover:grayscale-0 hover:bg-zinc-800/30"
              }`}
            >
              <div className={`transition-transform duration-300 ${r.ok ? "scale-110" : ""}`}>
                {r.ok ? (
                  <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
                ) : (
                  <Circle className="w-7 h-7 stroke-[1.5] opacity-30" />
                )}
              </div>
              <span className="font-bold tracking-tight">{r.label}</span>
            </li>
          ))}
        </ul>

        {/* Premium Quote Section */}
        <div className="relative mt-8 pt-10 border-t border-zinc-800/50">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 p-2 rounded-full text-indigo-500 shadow-xl">
            <Quote size={20} fill="currentColor" className="opacity-80" />
          </div>
          
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <p className="text-3xl text-zinc-100 font-extrabold italic leading-tight tracking-tight px-4 flex flex-col items-center">
              <span className="text-indigo-400 opacity-50 mb-4 h-1 w-20 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
              “Mejor pocas operaciones precisas que muchas no tanto, cada operacion conlleva RIESGO de perder lo ganado... think about it”
            </p>
            <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em] pt-4">— Jesse Livermore Protocol —</p>
          </div>
        </div>
      </div>
    </div>
  );
}

