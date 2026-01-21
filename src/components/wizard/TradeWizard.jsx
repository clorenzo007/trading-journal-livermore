import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTrade } from "../../api/trades";

import StepIdentity from "./StepIdentity";
import StepEntry from "./StepEntry";
import StepRisk from "./StepRisk";
import StepExit from "./StepExit";
import StepPsychologyPre from "./StepPsychologyPre";
import StepPsychologyPost from "./StepPsychologyPost";
import StepConfirm from "./StepConfirm";
import StepFinish from "./StepFinish";
import ProgressBar from "./ProgressBar";

const EMPTY_TRADE = {
  symbol: "",
  strategy_type: "",
  pattern: "",

  entry_date: "",
  entry_price: "",
  position_size: "",

  stop_loss: "",
  risk_percent: "",

  exit_date: "",
  exit_price: "",
  profit_loss: "",
  outcome: "",

  emotional_state_pre: "",
  reason_for_entry: "",

  emotional_state_post: "",
  reason_for_exit: "",
  review_notes: "",

  reviewed: false,
  review: {
    score: "",
    followedPlan: false,
    ruleBroken: "",
    lesson: "",
    wouldRepeat: false,
  },
};

export default function TradeWizard() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [step, setStep] = useState(0);
  const [trade, setTrade] = useState({ ...EMPTY_TRADE });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const steps = [
    "Identity",
    "Entry",
    "Risk",
    "Exit",
    "Psychology (Pre)",
    "Psychology (Post)",
    "Confirm",
    "Finish",
  ];

  function next() {
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function update(patch) {
    setTrade((prev) => ({
      ...prev,
      ...patch,
    }));
  }

  async function saveTrade() {
    try {
      setSaving(true);
      setError(null);

      const payload = {
        ...trade,
        entry_price: Number(trade.entry_price),
        position_size: Number(trade.position_size),
        stop_loss: Number(trade.stop_loss),
        risk_percent: Number(trade.risk_percent),
        exit_price: trade.exit_price ? Number(trade.exit_price) : undefined,
        profit_loss: trade.profit_loss ? Number(trade.profit_loss) : undefined,
      };

      await createTrade(payload);
      setSaved(true);
    } catch (e) {
      console.error(e);
      setError("Failed to save trade");
    } finally {
      setSaving(false);
    }
  }

  function goDashboard() {
    navigate("/dashboard");
  }

  // ======================
  // Keyboard navigation
  // ======================
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Enter") next();
      if (e.key === "Escape") back();
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="fixed inset-0 bg-black text-zinc-100 flex flex-col">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4 flex justify-between items-center">
        <div className="font-mono text-sm text-zinc-400">TRADE TERMINAL</div>
        <div className="font-mono text-xs text-zinc-500">
          Step {step + 1} / {steps.length}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-10 max-w-3xl mx-auto w-full">
        <ProgressBar steps={steps} current={step} />

        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-300 p-3 rounded mt-4">
            {error}
          </div>
        )}

        <div className="mt-8">
          {step === 0 && (
            <StepIdentity trade={trade} setTrade={update} onNext={next} />
          )}

          {step === 1 && (
            <StepEntry
              trade={trade}
              setTrade={update}
              onNext={next}
              onBack={back}
            />
          )}

          {step === 2 && (
            <StepRisk
              trade={trade}
              setTrade={update}
              onNext={next}
              onBack={back}
            />
          )}

          {step === 3 && (
            <StepExit
              trade={trade}
              setTrade={update}
              onNext={next}
              onBack={back}
            />
          )}

          {step === 4 && (
            <StepPsychologyPre
              trade={trade}
              setTrade={update}
              onNext={next}
              onBack={back}
            />
          )}

          {step === 5 && (
            <StepPsychologyPost
              trade={trade}
              setTrade={update}
              onNext={next}
              onBack={back}
            />
          )}

          {step === 6 && (
            <StepConfirm trade={trade} onNext={next} onBack={back} />
          )}

          {step === 7 && (
            <StepFinish
              trade={trade}
              onBack={back}
              onFinish={saveTrade}
              saving={saving}
            />
          )}
        </div>
      </div>

      {/* Modal */}
      {saved && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-sm text-center space-y-4">
            <h2 className="text-xl font-semibold">Trade saved</h2>
            <p className="text-zinc-400">Your trade was successfully saved.</p>

            <button
              onClick={goDashboard}
              className="w-full px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500"
            >
              Go to dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
