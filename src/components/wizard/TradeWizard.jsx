import { useState } from "react";
import StepIdentity from "./StepIdentity";
import StepEntry from "./StepEntry";
import StepRisk from "./StepRisk";
import StepExit from "./StepExit";
import StepPsychologyPre from "./StepPsychologyPre";
import StepPsychologyPost from "./StepPsychologyPost";
import StepConfirm from "./StepConfirm";
import StepFinish from "./StepFinish";
import ProgressBar from "./ProgressBar";
import { createTrade } from "../../api/trades";

// ==========================
// Helpers
// ==========================

function calculatePLPercent(entry, exit) {
  const e = Number(entry);
  const x = Number(exit);

  if (!e || !x || isNaN(e) || isNaN(x)) return "";

  const isLong = x >= e;

  let pl;
  if (isLong) {
    pl = ((x - e) / e) * 100;
  } else {
    pl = ((e - x) / e) * 100;
  }

  return Number(pl.toFixed(2));
}

function suggestOutcome(pl) {
  const n = Number(pl);
  if (isNaN(n)) return "";
  if (n > 0) return "Win";
  if (n < 0) return "Loss";
  return "Break-even";
}

function normalizePayload(data) {
  return {
    symbol: data.symbol,
    strategy_type: data.strategy_type,
    pattern: data.pattern,

    entry_date: data.entry_date
      ? new Date(data.entry_date).toISOString()
      : null,
    entry_price: Number(data.entry_price),
    position_size: Number(data.position_size),

    stop_loss: Number(data.stop_loss),
    risk_percent: Number(data.risk_percent),

    exit_date: data.exit_date ? new Date(data.exit_date).toISOString() : null,
    exit_price: Number(data.exit_price),
    profit_loss: Number(data.profit_loss),
    outcome: data.outcome,

    emotional_state_pre: data.emotional_state_pre,
    reason_for_entry: data.reason_for_entry,

    emotional_state_post: data.emotional_state_post,
    reason_for_exit: data.reason_for_exit,
    review_notes: data.review_notes,

    review: {
      score: Number(data.review.score),
      followedPlan: Boolean(data.review.followedPlan),
      ruleBroken: data.review.ruleBroken,
      lesson: data.review.lesson,
      wouldRepeat: Boolean(data.review.wouldRepeat),
    },
  };
}

// ==========================
// Wizard
// ==========================

const STEPS = [
  "Identity",
  "Entry",
  "Risk",
  "Exit",
  "Psychology Pre",
  "Psychology Post",
  "Confirm",
  "Finish",
];

export default function TradeWizard({ onClose }) {
  const [step, setStep] = useState(0);

  const [tradeData, setTradeData] = useState({
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

    review: {
      score: "",
      followedPlan: false,
      ruleBroken: "",
      lesson: "",
      wouldRepeat: false,
    },
  });

  function updateField(field, value) {
    setTradeData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      if (field === "entry_price" || field === "exit_price") {
        const pl = calculatePLPercent(updated.entry_price, updated.exit_price);

        if (pl !== "") {
          updated.profit_loss = pl;
          updated.outcome = suggestOutcome(pl);
        }
      }

      return updated;
    });
  }

  function updateReview(field, value) {
    setTradeData((prev) => ({
      ...prev,
      review: {
        ...prev.review,
        [field]: value,
      },
    }));
  }

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1);
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  async function submitTrade() {
    const payload = normalizePayload(tradeData);
    await createTrade(payload);
    next();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur">
      <div className="max-w-5xl mx-auto p-6 text-[13px] text-zinc-200 h-full flex flex-col">
        <ProgressBar steps={STEPS} current={step} />

        <div className="flex-1 overflow-y-auto mt-4">
          {step === 0 && (
            <StepIdentity data={tradeData} onChange={updateField} />
          )}
          {step === 1 && <StepEntry data={tradeData} onChange={updateField} />}
          {step === 2 && <StepRisk data={tradeData} onChange={updateField} />}
          {step === 3 && (
            <StepExit
              data={tradeData}
              onChange={updateField}
              setData={setTradeData}
            />
          )}
          {step === 4 && (
            <StepPsychologyPre data={tradeData} onChange={updateField} />
          )}
          {step === 5 && (
            <StepPsychologyPost data={tradeData} onChange={updateField} />
          )}
          {step === 6 && (
            <StepConfirm
              data={tradeData}
              onChange={updateField}
              onReviewChange={updateReview}
            />
          )}
          {step === 7 && <StepFinish />}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
          <button
            onClick={back}
            disabled={step === 0}
            className="px-4 py-2 rounded bg-zinc-800 disabled:opacity-40"
          >
            Back
          </button>

          {step < STEPS.length - 2 && (
            <button onClick={next} className="px-4 py-2 rounded bg-indigo-600">
              Next
            </button>
          )}

          {step === STEPS.length - 2 && (
            <button
              onClick={submitTrade}
              className="px-4 py-2 rounded bg-emerald-600"
            >
              Confirm & Save
            </button>
          )}

          {step === STEPS.length - 1 && (
            <button onClick={onClose} className="px-4 py-2 rounded bg-zinc-700">
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
