import { LineChart, ShieldCheck, TrendingUp } from "lucide-react";
import mikiLogo from "../../assets/mikiLogo";
import { useLanguage, LanguageSwitcher } from "../../context/LanguageContext";

/**
 * Shared shell for Login/Register: branding panel (hidden on small screens)
 * plus the form panel. Keeps both auth pages visually consistent.
 */
export default function AuthLayout({ children }) {
  const { t } = useLanguage();

  const features = [
    { icon: LineChart, text: t("Dashboard con métricas en tiempo real") },
    { icon: ShieldCheck, text: t("Checklist de disciplina antes de cada entrada") },
    { icon: TrendingUp, text: t("Setups, patrones y cuentas a tu medida") },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Branding panel */}
      <div className="hidden md:flex md:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-r border-zinc-800">
        <img
          src={mikiLogo}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-28 -bottom-28 w-[560px] opacity-[0.07] grayscale"
        />

        <div className="relative flex items-center gap-3">
          <img src={mikiLogo} alt="MIKI Trading" className="w-10 h-10 rounded-lg" />
          <span className="text-lg font-bold tracking-tight">Trading Journal</span>
        </div>

        <div className="relative space-y-6">
          <h2 className="text-3xl font-bold leading-tight">
            {t("Operá con método,")}
            <br />
            {t("no con impulso.")}
          </h2>
          <ul className="space-y-3">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                <span className="w-8 h-8 shrink-0 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <feature.icon size={16} />
                </span>
                {feature.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-xs text-zinc-600">
          MIKI Trading © {new Date().getFullYear()}
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        <img
          src={mikiLogo}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none md:hidden fixed inset-0 m-auto w-[380px] max-w-[70vw] max-h-[70vw] object-contain opacity-[0.045] grayscale"
        />

        <LanguageSwitcher className="absolute top-4 right-4 z-10" />

        <div className="md:hidden absolute top-6 left-6 flex items-center gap-2 z-10">
          <img src={mikiLogo} alt="MIKI Trading" className="w-8 h-8 rounded-lg" />
          <span className="font-bold">Trading Journal</span>
        </div>

        <div className="relative z-10 w-full flex justify-center">{children}</div>
      </div>
    </div>
  );
}
