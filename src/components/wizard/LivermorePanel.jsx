import { useState } from "react";

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
    <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-zinc-800 p-4 bg-zinc-900">
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden w-full text-left text-sm text-zinc-300 mb-2"
      >
        Reglas Livermore {open ? "▲" : "▼"}
      </button>

      <div className={`${open ? "block" : "hidden"} lg:block`}>
        <h2 className="font-semibold mb-4">Reglas Livermore</h2>
        <ul className="space-y-2 text-sm">
          {rules.map((r, i) => (
            <li
              key={i}
              className={`flex items-center gap-2 ${
                r.ok ? "text-emerald-400" : "text-zinc-500"
              }`}
            >
              <span>{r.ok ? "✔" : "○"}</span>
              <span>{r.label}</span>
            </li>
          ))}
        </ul>

        <p className="text-xs text-zinc-400 mt-4">
          “El dinero se gana sentándose, no operando.”
        </p>
      </div>
    </div>
  );
}
