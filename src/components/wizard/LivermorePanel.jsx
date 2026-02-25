import { useState } from "react";

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
    <div className="w-full border-t lg:border-t-0 border-zinc-800 p-6 bg-zinc-900">
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden w-full text-left text-lg text-zinc-300 mb-2 font-bold"
      >
        Reglas Livermore {open ? "▲" : "▼"}
      </button>

      <div className={`${open ? "block" : "hidden"} lg:block`}>
        <h2 className="font-black mb-8 text-4xl text-white tracking-tight uppercase">Reglas Livermore</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-2xl font-semibold">
          {rules.map((r, i) => (
            <li
              key={i}
              className={`flex items-center gap-4 ${
                r.ok ? "text-emerald-400" : "text-zinc-500"
              }`}
            >
              <span className="text-3xl">{r.ok ? "✔" : "○"}</span>
              <span>{r.label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-12 p-8 bg-zinc-950/50 border-l-8 border-indigo-600 rounded-r-2xl shadow-inner">
          <p className="text-3xl text-zinc-100 font-bold italic leading-snug">
            “Mejor pocas operaciones precisas que muchas no tanto, cada operacion conlleva RIESGO de perder lo ganado... think about it”
          </p>
        </div>
      </div>
    </div>
  );
}
