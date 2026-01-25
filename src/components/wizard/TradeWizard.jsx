import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { createTrade, getTradeById, updateTrade } from "../../api/trades";

import StepIdentity from "./StepIdentity";
import StepEntry from "./StepEntry";
import StepRisk from "./StepRisk";
import StepExit from "./StepExit";
import StepPsychologyPre from "./StepPsychologyPre";
import StepPsychologyPost from "./StepPsychologyPost";
import StepConfirm from "./StepConfirm";
import StepFinish from "./StepFinish";

import ProgressBar from "./ProgressBar";
import LivermorePanel from "./LivermorePanel";

import EntryImageUploader from "../EntryImageUploader";
import ReviewImageUploader from "../ReviewImageUploader";
import WizardCard from "./WizardCard";

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
};

const STEPS = [
  "Identity",
  "Entry",
  "Risk",
  "Exit",
  "Psychology (Pre)",
  "Psychology (Post)",
  "Images",
  "Confirm",
  "Finish",
];

export default function TradeWizard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [step, setStep] = useState(0);
  const [trade, setTrade] = useState({ ...EMPTY_TRADE });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  // ======================
  // Load trade (edit mode)
  // ======================
  useEffect(() => {
    if (!isEdit) return;

    async function load() {
      try {
        setLoading(true);
        const data = await getTradeById(id);
        setTrade(data);
      } catch {
        setError("Failed to load trade");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, isEdit]);

  // ======================
  // Helpers
  // ======================
  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function update(patch) {
    setTrade((prev) => ({ ...prev, ...patch }));
  }

  // ======================
  // Save
  // ======================
  async function saveTrade() {
    try {
      setSaving(true);
      setError(null);

      const payload = {
        ...trade,
        entry_price: trade.entry_price ? Number(trade.entry_price) : undefined,
        position_size: trade.position_size
          ? Number(trade.position_size)
          : undefined,
        stop_loss: trade.stop_loss ? Number(trade.stop_loss) : undefined,
        risk_percent: trade.risk_percent
          ? Number(trade.risk_percent)
          : undefined,
        exit_price: trade.exit_price ? Number(trade.exit_price) : undefined,
        profit_loss: trade.profit_loss ? Number(trade.profit_loss) : undefined,
      };

      if (isEdit) {
        await updateTrade(id, payload);
      } else {
        await createTrade(payload);
      }

      setSaved(true);
    } catch {
      setError("Failed to save trade");
    } finally {
      setSaving(false);
    }
  }

  function goDashboard() {
    navigate("/dashboard");
  }

  if (loading) {
    return <div className="p-6 text-zinc-400">Loading trade…</div>;
  }

  return (
    <div className="fixed inset-0 bg-black text-zinc-100 flex flex-col">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4 flex justify-between items-center">
        <div className="font-mono text-sm text-zinc-400">
          {isEdit ? "EDIT TRADE" : "NEW TRADE"}
        </div>
        <div className="font-mono text-xs text-zinc-500">
          Step {step + 1} / {STEPS.length}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Wizard */}
        <div className="flex-1 overflow-y-auto px-6 py-10 max-w-3xl mx-auto w-full space-y-6">
          <ProgressBar steps={STEPS} current={step} />

          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 p-3 rounded">
              {error}
            </div>
          )}

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
            <WizardCard title="Images">
              <div className="space-y-6">
                <EntryImageUploader trade={trade} setTrade={setTrade} />
                <ReviewImageUploader trade={trade} setTrade={setTrade} />
              </div>

              <div className="flex justify-between pt-6">
                <button
                  onClick={back}
                  className="px-5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700"
                >
                  Back
                </button>
                <button
                  onClick={next}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-medium"
                >
                  Next
                </button>
              </div>
            </WizardCard>
          )}

          {step === 7 && (
            <StepConfirm trade={trade} onNext={next} onBack={back} />
          )}

          {step === 8 && (
            <StepFinish trade={trade} onBack={back} onFinish={saveTrade} />
          )}
        </div>

        {/* Livermore Panel */}
        <LivermorePanel form={trade} />
      </div>

      {/* Success modal */}
      {saved && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-sm text-center space-y-4">
            <h2 className="text-xl font-semibold">
              {isEdit ? "Trade updated" : "Trade saved"}
            </h2>

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
