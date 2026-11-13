import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { login as loginApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import AuthLayout from "../components/layout/AuthLayout";
import VerifyCodeForm from "../components/auth/VerifyCodeForm";

/**
 * Login Page.
 * Entry point for authentication.
 * Handles email/password submission and token storage via AuthContext.
 */
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [pendingEmail, setPendingEmail] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();

  async function submit(e) {
    e.preventDefault();
    setError(null);

    try {
      const res = await loginApi(email, password);
      login(res.user, res.token);
      navigate("/");
    } catch (err) {
      if (err.needsVerification) {
        setPendingEmail(err.email || email);
      } else {
        setError(t(err.message));
      }
    }
  }

  if (pendingEmail) {
    return (
      <AuthLayout>
        <VerifyCodeForm
          email={pendingEmail}
          onBack={() => setPendingEmail(null)}
          onVerified={(user, token) => {
            login(user, token);
            navigate("/");
          }}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <form
        onSubmit={submit}
        className="bg-zinc-900/90 backdrop-blur border border-zinc-800 rounded-2xl p-8 w-[380px] max-w-full space-y-5 shadow-2xl shadow-black/40"
      >
        <div>
          <h1 className="text-2xl font-bold">{t("Login")}</h1>
          <p className="text-sm text-zinc-500 mt-1">{t("Ingresá para continuar tu journal.")}</p>
        </div>

        {error && (
          <div className="bg-rose-900/40 text-rose-300 text-sm p-2 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder={t("Email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="password"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder={t("Password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 transition-colors rounded-lg py-2.5 font-medium flex items-center justify-center gap-2">
          <LogIn size={16} />
          {t("Entrar")}
        </button>

        <div className="text-center text-sm text-zinc-400">
          {t("¿No tenés cuenta?")}{" "}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
            {t("Registrate")}
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
