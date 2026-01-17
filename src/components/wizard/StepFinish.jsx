import { useNavigate } from "react-router-dom";

export default function StepFinish({ form, restart }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 text-center">
      <h1 className="text-2xl font-bold text-emerald-400">Trade registrado</h1>

      <p className="text-zinc-400">
        Este trade ya forma parte de tu historial disciplinario.
      </p>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-left space-y-1">
        <div>
          <b>Símbolo:</b> {form.symbol}
        </div>
        <div>
          <b>Estrategia:</b> {form.strategy_type}
        </div>
        <div>
          <b>Patrón:</b> {form.pattern}
        </div>
        <div>
          <b>Resultado:</b>{" "}
          <span
            className={
              form.outcome === "Win"
                ? "text-emerald-400"
                : form.outcome === "Loss"
                ? "text-rose-400"
                : "text-zinc-300"
            }
          >
            {form.outcome}
          </span>
        </div>
        <div>
          <b>PnL:</b>{" "}
          <span
            className={
              form.profit_loss > 0
                ? "text-emerald-400"
                : form.profit_loss < 0
                ? "text-rose-400"
                : "text-zinc-300"
            }
          >
            {form.profit_loss}
          </span>
        </div>
        <div>
          <b>Emoción final:</b> {form.emotional_state_post}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={restart}
          className="flex-1 h-12 rounded-xl bg-zinc-800 hover:bg-zinc-700"
        >
          Nuevo trade
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-500"
        >
          Ir al dashboard
        </button>
      </div>
    </div>
  );
}
