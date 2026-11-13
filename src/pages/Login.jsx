import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as loginApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useLanguage, LanguageSwitcher } from "../context/LanguageContext";

/**
 * Login Page.
 * Entry point for authentication.
 * Handles email/password submission and token storage via AuthContext.
 */
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
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
      setError(t(err.message));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white relative">
      <LanguageSwitcher className="absolute top-4 right-4" />
      <form
        onSubmit={submit}
        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-[360px] space-y-4"
      >
        <h1 className="text-xl font-bold text-center">{t("Login")}</h1>

        {error && (
          <div className="bg-rose-900/40 text-rose-300 text-sm p-2 rounded">
            {error}
          </div>
        )}

        <input
          className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2"
          placeholder={t("Email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2"
          placeholder={t("Password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 hover:bg-blue-500 rounded py-2">
          {t("Entrar")}
        </button>

        <div className="text-center text-sm text-zinc-400">
          {t("¿No tenés cuenta?")}{" "}
          <Link to="/register" className="text-blue-400">
            {t("Registrate")}
          </Link>
        </div>
      </form>
    </div>
  );
}
