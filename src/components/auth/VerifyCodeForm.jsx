import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { verifyEmail, resendCode } from "../../api/auth";
import { useLanguage } from "../../context/LanguageContext";

/**
 * Six-digit email verification step, shown right after registering (or on
 * login, if the account was never verified). Shares the card look of
 * Login/Register so it reads as one continuous flow.
 */
export default function VerifyCodeForm({ email, onVerified, onBack }) {
  const { t } = useLanguage();
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await verifyEmail(email, code.trim());
      onVerified(res.user, res.token);
    } catch (err) {
      setError(t(err.message));
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError(null);
    setResent(false);
    try {
      await resendCode(email);
      setResent(true);
    } catch (err) {
      setError(t(err.message));
    }
  }

  return (
    <form
      onSubmit={submit}
      className="bg-zinc-900/90 backdrop-blur border border-zinc-800 rounded-2xl p-8 w-[380px] max-w-full space-y-5 shadow-2xl shadow-black/40"
    >
      <div>
        <h1 className="text-2xl font-bold">{t("Confirmá tu email")}</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {t("Te enviamos un código de 6 dígitos a")} <span className="text-zinc-300">{email}</span>.
        </p>
      </div>

      {error && <div className="bg-rose-900/40 text-rose-300 text-sm p-2 rounded-lg">{error}</div>}
      {resent && !error && (
        <div className="bg-emerald-900/30 text-emerald-300 text-sm p-2 rounded-lg">
          {t("Te mandamos un código nuevo.")}
        </div>
      )}

      <div className="relative">
        <ShieldCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          autoFocus
          inputMode="numeric"
          maxLength={6}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-2.5 text-sm tracking-[0.3em] text-center outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder={t("Código de 6 dígitos")}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
        />
      </div>

      <button
        disabled={loading || code.trim().length < 6}
        className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 transition-colors rounded-lg py-2.5 font-medium"
      >
        {loading ? t("Verificando...") : t("Confirmar código")}
      </button>

      <div className="flex items-center justify-between text-sm text-zinc-400">
        <button type="button" onClick={onBack} className="hover:text-zinc-300">
          {t("Volver")}
        </button>
        <button type="button" onClick={handleResend} className="text-indigo-400 hover:text-indigo-300 font-medium">
          {t("Reenviar código")}
        </button>
      </div>
    </form>
  );
}
