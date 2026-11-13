// Valores que cuentan como "vacío": los imports de MT5 llegan con placeholders.
const PLACEHOLDERS = new Set(["", "n/a", "na", "-", "—", "mt5 import"]);

/** true si el campo tiene un valor real (0 cuenta como completo, ej. P/L en BreakEven). */
export function isFilled(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "number") return !Number.isNaN(value);
  return !PLACEHOLDERS.has(String(value).trim().toLowerCase());
}

/**
 * Reglas del checklist. Cada regla se cumple cuando TODOS sus campos están completos.
 * - "pre": lo que hay que tener antes de entrar (protocolo Livermore original).
 * - "post": cierre del trade: números de salida y parte emocional.
 */
export const LIVERMORE_RULES = [
  { group: "pre", label: "Tengo un setup definido", fields: ["pattern"] },
  { group: "pre", label: "Tengo una estrategia clara", fields: ["strategy_type"] },
  { group: "pre", label: "Sé qué estoy operando", fields: ["symbol", "direction"] },
  { group: "pre", label: "Definí punto de entrada", fields: ["entry_date", "entry_price"] },
  { group: "pre", label: "Definí tamaño", fields: ["position_size"] },
  { group: "pre", label: "Definí stop", fields: ["stop_loss"] },
  { group: "pre", label: "Definí objetivo y R:R", fields: ["take_profit", "rr_ratio"] },
  { group: "pre", label: "Definí riesgo", fields: ["risk_percent"] },
  { group: "pre", label: "Escribí mi razón", fields: ["reason_for_entry"] },
  { group: "pre", label: "Reconozco mi estado emocional", fields: ["emotional_state_pre"] },

  { group: "post", label: "Registré la salida", fields: ["exit_date", "exit_price"] },
  { group: "post", label: "Registré máx/mín del precio", fields: ["highest_lowest_price"] },
  { group: "post", label: "Registré resultado y P/L", fields: ["outcome", "profit_loss"] },
  { group: "post", label: "Reconozco mi emoción al salir", fields: ["emotional_state_post"] },
  { group: "post", label: "Escribí por qué salí", fields: ["reason_for_exit"] },
  { group: "post", label: "Escribí mi lección", fields: ["review_notes"] },
];

export function evaluateRules(form = {}) {
  return LIVERMORE_RULES.map((r) => ({ ...r, ok: r.fields.every((f) => isFilled(form[f])) }));
}
