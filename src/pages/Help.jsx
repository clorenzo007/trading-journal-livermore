import { ChevronDown, BookOpen, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const MANUAL_URL = "https://claude.ai/artifact/9YRpBNrNA4UYj7Tyxyq49S";

const FAQ_KEYS = [
  ["No veo nada en el Dashboard, ¿qué hago?", "Necesitás una cuenta activa. Andá a Cuentas, creá una (o activá una existente) y el Dashboard va a mostrar sus trades."],
  ["¿Cómo cambio de cuenta de trading?", "Usá el selector que aparece en el menú superior, al lado del switch de idioma. Todo lo que veas en el Dashboard y cargues en el wizard corresponde a esa cuenta."],
  ["¿Cómo cambio el idioma de la app?", "Con el switch ES / EN, siempre visible arriba a la derecha. Se guarda tu elección para la próxima vez que entres."],
  ["Cargué un trade mal, ¿puedo corregirlo?", "Sí. Andá a Revisar trades, abrí el trade y tocá Editar trade para volver a pasar por el wizard con esos datos cargados."],
  ["¿Puedo importar mi historial de MetaTrader?", "Sí, desde Importar trades podés subir un archivo .xlsx o .csv. Se carga contra la cuenta activa que tengas seleccionada en ese momento."],
  ["Olvidé mi contraseña, ¿qué hago?", "Pedile a un administrador que te la resetee desde Configuración → Usuarios. Todavía no hay recuperación de contraseña autogestionada."],
  ["¿Quién puede crear o administrar usuarios?", "Sólo las cuentas con rol de administrador ven la sección Usuarios dentro de Configuración."],
  ["¿Las estrategias y patrones se autocompletan solos?", "No: primero cargalos en Configuración → Estrategias / Patrones. Ahí sí van a aparecer sugeridos en el paso 1 del wizard."],
];

export default function Help() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h1 className="text-2xl font-bold text-white mb-1">{t("Ayuda")}</h1>
      <p className="text-zinc-400 text-sm mb-6">{t("Preguntas frecuentes sobre cómo usar el journal.")}</p>

      <a
        href={MANUAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-3 bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-xl px-5 py-4 mb-8 text-white"
      >
        <span className="flex items-center gap-3">
          <BookOpen size={20} />
          <span>
            <span className="block font-semibold">{t("Manual de usuario completo")}</span>
            <span className="block text-xs text-indigo-100">{t("Guía paso a paso con capturas, para consultar online.")}</span>
          </span>
        </span>
        <ExternalLink size={18} className="shrink-0" />
      </a>

      <div className="space-y-2">
        {FAQ_KEYS.map(([q, a], i) => {
          const isOpen = openIndex === i;
          return (
            <div key={q} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium text-zinc-100 hover:text-white transition-colors"
                aria-expanded={isOpen}
              >
                {t(q)}
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-sm text-zinc-400 leading-relaxed">{t(a)}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
