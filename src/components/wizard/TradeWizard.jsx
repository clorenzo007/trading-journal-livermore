import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createTrade,
  getTradeById,
  updateTrade,
  uploadEntryImage,
  uploadReviewImage,
} from "../../api/trades";

import StepIdentity from "./StepIdentity";
import StepEntry from "./StepEntry";
import StepRisk from "./StepRisk";
import StepExit from "./StepExit";
import StepPsychologyPre from "./StepPsychologyPre";
import StepPsychologyPost from "./StepPsychologyPost";
import StepImages from "./StepImages";
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
};


// 👉 Fecha y hora LOCAL en formato datetime-local
function nowLocalDatetime() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export default function TradeWizard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [step, setStep] = useState(0);
  const [trade, setTrade] = useState(() => {
    if (id) return { ...EMPTY_TRADE };
    return { ...EMPTY_TRADE, entry_date: nowLocalDatetime() };
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const TOTAL_STEPS = 9;

  // ======================
  // LOAD EXISTING TRADE
  // ======================
  useEffect(() => {
    if (!id) return;

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
  }, [id]);

  // ======================
  // VALIDATION
  // ======================
  const validateTrade = () => {
    const required = [
      ["symbol", "Symbol"],
      ["strategy_type", "Strategy"],
      ["pattern", "Pattern"],
      ["entry_date", "Entry date"],
      ["entry_price", "Entry price"],
      ["position_size", "Position size"],
      ["stop_loss", "Stop loss"],
      ["risk_percent", "Risk percent"],
      ["emotional_state_pre", "Emotional state (pre)"],
      ["reason_for_entry", "Reason for entry"],
    ];

    for (const [key, label] of required) {
      if (!trade[key] && trade[key] !== 0) {
        return `Missing required field: ${label}`;
      }
    }

    if (trade.exit_date && !trade.exit_price) {
      return "Exit price is required when exit date is set";
    }

    if (trade.exit_price && !trade.outcome) {
      return "Outcome is required when exit price is set";
    }

    return null;
  };

  // ======================
  // NAV
  // ======================
  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const cancel = () => navigate("/dashboard");

  const update = (patch) => setTrade((prev) => ({ ...prev, ...patch }));

  // ======================
  // SAVE (ONLY HERE)
  // ======================
  async function saveTrade() {
    const validationError = validateTrade();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        ...trade,
        entry_price: Number(trade.entry_price),
        position_size: Number(trade.position_size),
        stop_loss: Number(trade.stop_loss),
        risk_percent: Number(trade.risk_percent),
        exit_date: trade.exit_date || undefined, // ✅ FIX: Avoid empty string for Date
        exit_price: trade.exit_price ? Number(trade.exit_price) : undefined,
        profit_loss: trade.profit_loss ? Number(trade.profit_loss) : undefined,
        outcome: trade.outcome || undefined, // ✅ FIX: Avoid empty string for Enum
      };

      let savedTrade;
      if (isEdit) {
        savedTrade = await updateTrade(trade._id, payload);
      } else {
        savedTrade = await createTrade(payload);
      }

      // ==========================
      // HANDLE DEFERRED UPLOADS
      // ==========================
      if (trade._entryImageFile) {
        await uploadEntryImage(savedTrade._id, trade._entryImageFile);
      }

      if (trade._reviewImageFile) {
        await uploadReviewImage(savedTrade._id, trade._reviewImageFile);
      }

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to save trade");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center text-zinc-400">
        Loading trade...
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black text-zinc-100 flex flex-col">
      {/* HEADER */}
      <div className="border-b border-zinc-800 px-6 py-4 flex justify-between">
        <div className="font-semibold">
          {isEdit ? "Edit trade" : "New trade"}
        </div>
        <button
          onClick={cancel}
          className="text-sm text-zinc-400 hover:text-white"
        >
          Cancel
        </button>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto px-6 py-10 max-w-3xl mx-auto w-full">
        <ProgressBar step={step + 1} totalSteps={TOTAL_STEPS} />

        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-300 p-3 rounded mb-4">
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
          <StepImages
            trade={trade}
            setTrade={update}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 7 && (
          <StepConfirm trade={trade} onNext={next} onBack={back} />
        )}
        {step === 8 && (
          <StepFinish
            trade={trade}
            onBack={back}
            onFinish={saveTrade}
            saving={saving}
          />
        )}
      </div>
    </div>
  );
}
